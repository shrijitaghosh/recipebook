"""Ingredient normalization and Pantry Match scoring logic."""

import json
import os
import re
from typing import Dict, List, Tuple

# Ingredients that are assumed to be almost always on hand (pantry staples).
# These never count as "missing" and never hurt the Pantry Match percentage,
# but they DO count as "available" if the recipe uses them.
STAPLE_INGREDIENTS = {
    "salt",
    "oil",
    "water",
    "turmeric",
    "cumin seeds",
    "coriander powder",
    "pepper",
    "black pepper",
    "sugar",
}

# Maps common plural/variant forms to a canonical singular form.
# This is intentionally small and explicit rather than a generic stemmer,
# so behavior stays predictable.
_IRREGULAR_PLURALS = {
    "tomatoes": "tomato",
    "potatoes": "potato",
    "onions": "onion",
    "chillies": "chilli",
    "chilies": "chilli",
    "chili": "chilli",
    "chillis": "chilli",
    "eggs": "egg",
    "carrots": "carrot",
    "bananas": "banana",
    "apples": "apple",
    "lentils": "lentil",
    "cloves": "clove",
}


def normalize_ingredient(raw: str) -> str:
    """Normalize an ingredient name for matching.

    Lowercases, strips whitespace, removes punctuation, collapses internal
    whitespace, and maps common plural/variant forms to a canonical form so
    that "Tomato", "tomatoes", and "TOMATO " all normalize to "tomato".
    """
    if not raw:
        return ""
    text = raw.strip().lower()
    text = re.sub(r"[^a-z0-9\s]", "", text)
    text = re.sub(r"\s+", " ", text).strip()

    if text in _IRREGULAR_PLURALS:
        return _IRREGULAR_PLURALS[text]

    # Generic plural stripping for simple "s" plurals not already handled,
    # but avoid mangling words that legitimately end in "s" (e.g. "hummus").
    if text.endswith("es") and len(text) > 4 and not text.endswith("ses"):
        singular = text[:-2]
        return singular
    if text.endswith("s") and len(text) > 3 and not text.endswith("ss"):
        singular = text[:-1]
        return singular

    return text


def normalize_list(items: List[str]) -> set:
    return {normalize_ingredient(i) for i in items if normalize_ingredient(i)}


def calculate_pantry_match(
    recipe_ingredients: List[str], user_ingredients: List[str]
) -> Tuple[int, List[str], List[str]]:
    """Calculate Pantry Match percentage for a recipe.

    Staple ingredients (salt, oil, common spices) are excluded from the
    percentage calculation entirely -- they neither help nor hurt the score
    -- but are still reported as "available" since the user is assumed to
    have them.

    Returns:
        (pantry_match_percent, available_ingredients, missing_ingredients)
    """
    user_set = normalize_list(user_ingredients)

    non_staple_required = []
    available = []
    missing = []

    for raw_name in recipe_ingredients:
        norm = normalize_ingredient(raw_name)
        if not norm:
            continue

        if norm in STAPLE_INGREDIENTS:
            # Staples are assumed available; they don't count toward the
            # percentage denominator/numerator.
            available.append(raw_name)
            continue

        non_staple_required.append(raw_name)
        if norm in user_set:
            available.append(raw_name)
        else:
            missing.append(raw_name)

    total_required = len(non_staple_required)
    if total_required == 0:
        # A recipe made entirely of staples is trivially a full match.
        pantry_match = 100
    else:
        matched = total_required - len(missing)
        pantry_match = round((matched / total_required) * 100)

    return pantry_match, available, missing


def load_recipes(data_path: str = None) -> List[dict]:
    if data_path is None:
        data_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
            "data",
            "recipes.json",
        )
    with open(data_path, "r", encoding="utf-8") as f:
        return json.load(f)


# Diet hierarchy: which recipe diets are acceptable for a given user diet.
# Vegetarian users only ever see vegetarian recipes.
# Eggetarian users see vegetarian + eggetarian recipes.
# Non-vegetarian users see everything.
DIET_VISIBILITY: Dict[str, List[str]] = {
    "vegetarian": ["vegetarian"],
    "eggetarian": ["vegetarian", "eggetarian"],
    "non-vegetarian": ["vegetarian", "eggetarian", "non-vegetarian"],
}


def filter_recipes(
    recipes: List[dict],
    diet: str,
    meal_type: str,
) -> List[dict]:
    allowed_diets = DIET_VISIBILITY.get(diet, [diet])
    return [
        r
        for r in recipes
        if r["diet"] in allowed_diets and r["meal_type"] == meal_type
    ]


def rank_recipes(
    recipes: List[dict],
    user_ingredients: List[str],
    only_these_ingredients: bool,
    sort_by: str = "best_match",
) -> List[dict]:
    """Score, optionally filter for completeness, and sort recipes."""
    scored = []
    for recipe in recipes:
        ingredient_names = [ing["name"] for ing in recipe["ingredients"]]
        pantry_match, available, missing = calculate_pantry_match(
            ingredient_names, user_ingredients
        )
        scored.append(
            {
                **recipe,
                "pantry_match": pantry_match,
                "available_ingredients": available,
                "missing_ingredients": missing,
            }
        )

    if only_these_ingredients:
        scored = [r for r in scored if r["pantry_match"] == 100]

    if sort_by == "quickest":
        scored.sort(key=lambda r: (r["time_minutes"], -r["pantry_match"]))
    elif sort_by == "lowest_calories":
        scored.sort(key=lambda r: (r["calories"], -r["pantry_match"]))
    else:  # best_match (default)
        scored.sort(key=lambda r: (-r["pantry_match"], r["time_minutes"]))

    return scored

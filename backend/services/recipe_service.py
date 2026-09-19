"""Service layer: loads recipes once and exposes recommend/detail operations."""

from typing import List, Optional

from services.matching import (
    calculate_pantry_match,
    filter_recipes,
    load_recipes,
    rank_recipes,
)

_RECIPES_CACHE: Optional[List[dict]] = None


def get_all_recipes() -> List[dict]:
    global _RECIPES_CACHE
    if _RECIPES_CACHE is None:
        _RECIPES_CACHE = load_recipes()
    return _RECIPES_CACHE


def recommend(
    diet: str,
    meal_type: str,
    ingredients: List[str],
    only_these_ingredients: bool,
    sort_by: str,
) -> List[dict]:
    recipes = get_all_recipes()
    filtered = filter_recipes(recipes, diet, meal_type)
    ranked = rank_recipes(filtered, ingredients, only_these_ingredients, sort_by)
    return ranked


def get_recipe_by_id(recipe_id: str, ingredients: Optional[List[str]] = None) -> Optional[dict]:
    recipes = get_all_recipes()
    match = next((r for r in recipes if r["id"] == recipe_id), None)
    if match is None:
        return None

    result = dict(match)
    if ingredients:
        ingredient_names = [ing["name"] for ing in match["ingredients"]]
        pantry_match, available, missing = calculate_pantry_match(
            ingredient_names, ingredients
        )
        result["pantry_match"] = pantry_match
        result["available_ingredients"] = available
        result["missing_ingredients"] = missing
    else:
        result["pantry_match"] = None
        result["available_ingredients"] = []
        result["missing_ingredients"] = []

    return result

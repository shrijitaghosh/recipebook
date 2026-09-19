"""Recipe-related API routes."""

from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional

from models.schemas import (
    RecipeDetail,
    RecommendRequest,
    RecommendResponse,
    RecipeSummary,
)
from services import recipe_service

router = APIRouter(prefix="/api/recipes", tags=["recipes"])


@router.post("/recommend", response_model=RecommendResponse)
def recommend_recipes(payload: RecommendRequest):
    if not payload.ingredients:
        raise HTTPException(
            status_code=400,
            detail={
                "error": "no_ingredients",
                "message": "Add at least one ingredient before generating recipes.",
            },
        )

    ranked = recipe_service.recommend(
        diet=payload.diet.value,
        meal_type=payload.meal_type.value,
        ingredients=payload.ingredients,
        only_these_ingredients=payload.only_these_ingredients,
        sort_by=payload.sort_by.value,
    )

    summaries = [
        RecipeSummary(
            id=r["id"],
            name=r["name"],
            emoji=r["emoji"],
            pantry_match=r["pantry_match"],
            calories=r["calories"],
            time_minutes=r["time_minutes"],
            servings=r["servings"],
            available_ingredients=r["available_ingredients"],
            missing_ingredients=r["missing_ingredients"],
            short_description=r["short_description"],
        )
        for r in ranked
    ]

    return RecommendResponse(recipes=summaries, count=len(summaries))


@router.get("/{recipe_id}", response_model=RecipeDetail)
def get_recipe(recipe_id: str, ingredients: Optional[str] = Query(None)):
    """Fetch full recipe detail. Optionally pass ?ingredients=a,b,c to include
    pantry match / available / missing ingredients relative to a user's pantry."""
    user_ingredients: List[str] = []
    if ingredients:
        user_ingredients = [i.strip() for i in ingredients.split(",") if i.strip()]

    recipe = recipe_service.get_recipe_by_id(recipe_id, user_ingredients)
    if recipe is None:
        raise HTTPException(
            status_code=404,
            detail={
                "error": "recipe_not_found",
                "message": f"No recipe found with id '{recipe_id}'.",
            },
        )

    return RecipeDetail(**recipe)

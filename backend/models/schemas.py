"""Pydantic models for RecipeBook API requests and responses."""

from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field, field_validator


class DietType(str, Enum):
    vegetarian = "vegetarian"
    non_vegetarian = "non-vegetarian"
    eggetarian = "eggetarian"


class MealType(str, Enum):
    breakfast = "breakfast"
    lunch = "lunch"
    dinner = "dinner"
    snack = "snack"


class SortMode(str, Enum):
    best_match = "best_match"
    quickest = "quickest"
    lowest_calories = "lowest_calories"


class RecommendRequest(BaseModel):
    diet: DietType
    meal_type: MealType
    ingredients: List[str] = Field(default_factory=list)
    only_these_ingredients: bool = False
    sort_by: SortMode = SortMode.best_match

    @field_validator("ingredients")
    @classmethod
    def strip_empty(cls, v: List[str]) -> List[str]:
        return [i.strip() for i in v if i and i.strip()]


class IngredientOut(BaseModel):
    name: str
    quantity: Optional[str] = None


class RecipeSummary(BaseModel):
    id: str
    name: str
    emoji: str
    pantry_match: int
    calories: int
    time_minutes: int
    servings: int
    available_ingredients: List[str]
    missing_ingredients: List[str]
    short_description: str


class RecommendResponse(BaseModel):
    recipes: List[RecipeSummary]
    count: int


class RecipeDetail(BaseModel):
    id: str
    name: str
    emoji: str
    diet: DietType
    meal_type: MealType
    calories: int
    time_minutes: int
    servings: int
    pantry_match: Optional[int] = None
    ingredients: List[IngredientOut]
    instructions: List[str]
    available_ingredients: List[str] = Field(default_factory=list)
    missing_ingredients: List[str] = Field(default_factory=list)


class ErrorResponse(BaseModel):
    error: str
    message: str

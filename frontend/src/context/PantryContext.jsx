import { createContext, useContext, useState, useCallback, useMemo } from 'react'

const PantryContext = createContext(null)

const initialState = {
  diet: null,
  mealType: null,
  ingredients: [],
  onlyTheseIngredients: false,
}

export function PantryProvider({ children }) {
  const [diet, setDiet] = useState(initialState.diet)
  const [mealType, setMealType] = useState(initialState.mealType)
  const [ingredients, setIngredients] = useState(initialState.ingredients)
  const [onlyTheseIngredients, setOnlyTheseIngredients] = useState(
    initialState.onlyTheseIngredients
  )

  const addIngredient = useCallback((name) => {
    const trimmed = name.trim()
    if (!trimmed) return
    setIngredients((prev) => {
      const exists = prev.some(
        (i) => i.toLowerCase() === trimmed.toLowerCase()
      )
      if (exists) return prev
      return [...prev, trimmed]
    })
  }, [])

  const removeIngredient = useCallback((name) => {
    setIngredients((prev) => prev.filter((i) => i !== name))
  }, [])

  const reset = useCallback(() => {
    setDiet(initialState.diet)
    setMealType(initialState.mealType)
    setIngredients(initialState.ingredients)
    setOnlyTheseIngredients(initialState.onlyTheseIngredients)
  }, [])

  const value = useMemo(
    () => ({
      diet,
      setDiet,
      mealType,
      setMealType,
      ingredients,
      addIngredient,
      removeIngredient,
      onlyTheseIngredients,
      setOnlyTheseIngredients,
      reset,
    }),
    [diet, mealType, ingredients, onlyTheseIngredients, addIngredient, removeIngredient, reset]
  )

  return (
    <PantryContext.Provider value={value}>{children}</PantryContext.Provider>
  )
}

export function usePantry() {
  const ctx = useContext(PantryContext)
  if (!ctx) {
    throw new Error('usePantry must be used within a PantryProvider')
  }
  return ctx
}

import { RecipeListItem } from '@/types/recipeListItem'

export const mockRecipes: RecipeListItem[] = [
  {
    uri: 'at://did:plc:123/app.bookhive.recipe/1',
    title: 'Quick & Easy Pasta',
    description: 'Simple pasta you can make in 20 minutes',
    thumbnailUrl: '/mock/pasta.jpg',
    cookTimeMinutes: 20,
    serves: 2,
    ingredientSummary: 'pasta · egg · cheese',
    author: {
      handle: 'matilda',
      did: 'did:plc:123',
    }
  },
]

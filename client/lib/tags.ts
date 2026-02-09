/**
 * 재료명 정규화
 * 수량/단위 제거하고 소문자로 변환
 */
export function normalizeIngredient(name: string): string {
  return name
    .replace(/^\d+(\.\d+)?(\s*\/\s*\d+)?\s*(g|ml|kg|oz|cup|cups|tbsp|tsp|lb|lbs|l)?\s*/i, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s]/g, '')
    .replace(/\s+/g, '_')
}

/**
 * 재료 배열에서 자동으로 태그 생성
 * - ingredient: 각 재료
 * - cuisine: 요리 스타일 추론 (규칙 기반)
 * - attribute: 속성 추론 (vegan, spicy 등)
 */
export function generateTags(
  ingredients: Array<{ type: string; name?: string; title?: string }>,
  title: string,
  description?: string
): string[] {
  const tags: string[] = []
  
  ingredients
    .filter(ing => ing.type === 'ingredient' && ing.name)
    .forEach(ing => {
      const normalized = normalizeIngredient(ing.name!)
      if (normalized) {
        tags.push(`ingredient:${normalized}`)
      }
    })
  const text = `${title} ${description || ''}`.toLowerCase()
  
  const cuisinePatterns = [
    { pattern: /(김치|된장|고추장|간장|한식|korean|bibimbap|bulgogi|kimchi|doenjang|gochujang)/i, tag: 'korean' },
    { pattern: /(pasta|pizza|risotto|italian|parmesan|mozzarella)/i, tag: 'italian' },
    { pattern: /(sushi|ramen|tempura|japanese|miso|teriyaki|sake)/i, tag: 'japanese' },
    { pattern: /(curry|indian|masala|tandoori|naan|biryani)/i, tag: 'indian' },
    { pattern: /(taco|burrito|mexican|salsa|tortilla|enchilada)/i, tag: 'mexican' },
    { pattern: /(croissant|french|baguette|crepe|quiche)/i, tag: 'french' },
    { pattern: /(stir[- ]?fry|chinese|wok|dumpling|dim sum)/i, tag: 'chinese' },
    { pattern: /(pad thai|thai|tom yum|green curry)/i, tag: 'thai' },
  ]
  
  cuisinePatterns.forEach(({ pattern, tag }) => {
    if (pattern.test(text)) {
      tags.push(`cuisine:${tag}`)
    }
  })

  const animalProducts = [
    'meat', 'chicken', 'pork', 'beef', 'lamb', 'fish', 'seafood',
    'egg', 'eggs', 'milk', 'cream', 'cheese', 'butter', 'yogurt',
    '고기', '닭', '돼지', '소고기', '생선', '계란', '우유', '치즈', '버터'
  ]
  
  const hasAnimalProduct = ingredients.some(ing => {
    if (ing.type !== 'ingredient' || !ing.name) return false
    const normalized = ing.name.toLowerCase()
    return animalProducts.some(animal => normalized.includes(animal))
  })
  
  if (!hasAnimalProduct && ingredients.length > 0) {
    tags.push('attribute:vegan')
  }
  
  const healthyIngredients = [
    'tofu', 'beans', 'tuna', 'salmon', 'avocado', 'cabbage',
    'brown rice', 'oats', 'olive oil', 'almonds', '케일', '아보카도', '현미', '귀리'
  ]
  
  const isHealthy = ingredients.some(ing => {
    if (ing.type !== 'ingredient' || !ing.name) return false
    const normalized = ing.name.toLowerCase()
    return healthyIngredients.some(healthy => normalized.includes(healthy))
  }) || /healthy|다이어트/i.test(text)
  
  if (isHealthy) {
    tags.push('attribute:healthy')
  }
  
  const dessertIngredients = [
    'sugar', 'chocolate', 'cocoa', 'vanilla', 'cream', 'flour',
    'butter', 'egg', 'milk', 'honey', 'syrup',
    '설탕', '초콜릿', '생크림', '밀가루', '꿀'
  ]
  
  const isDessert = ingredients.some(ing => {
    if (ing.type !== 'ingredient' || !ing.name) return false
    const normalized = ing.name.toLowerCase()
    return dessertIngredients.some(dessert => normalized.includes(dessert))
  }) && /(dessert|cake|cookie|pie|tart|sweet|디저트|케이크|쿠키|파이)/i.test(text)
  
  if (isDessert) {
    tags.push('attribute:dessert')
  }
  
  if (/(quick|easy|simple|fast|간단|쉬운|빠른)/i.test(text)) {
    tags.push('attribute:quick')
  }
  
  return Array.from(new Set(tags))
}

export function formatTag(tag: string): string {
  const [prefix, value] = tag.split(':')
  
  if (prefix === 'ingredient') {
    return value.replace(/_/g, ' ')
  }
  
  if (prefix === 'cuisine') {
    return value.charAt(0).toUpperCase() + value.slice(1)
  }
  
  if (prefix === 'attribute') {
    const labels: Record<string, string> = {
      vegan: 'Vegan',
      spicy: 'Spicy',
      dessert: 'Dessert',
      quick: 'Quick & Easy'
    }
    return labels[value] || value
  }
  
  return tag
}

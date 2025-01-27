import { IngredientData } from '@/types';

const headersInterface = () => ({
  Authorization: `Bearer ${process.env.PRIVATE_API_KEY}`,
  'Content-Type': 'application/json',
});

export async function getIngredients(page: number, pageSize: number) {
  const response = await fetch(
    `${process.env.PRIVATE_API_URL}/gourmet-ingredients?sort[0]=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
    {
      method: 'GET',
      headers: headersInterface(),
    },
  );
  const ingredientResponse = await response.json();
  const ingredientData = ingredientResponse.data;
  const ingredient: IngredientData[] = ingredientData.map((data: IngredientData) => ({
    documentId: data.documentId,
    tournament_title: data.tournament_title,
    thumbnail_url: data.thumbnail_url,
    animation_title: data.animation_title,
    info: data.info,
  }));

  return ingredient;
}

export async function getIngredient(documentId: string) {
  const response = await fetch(`${process.env.PRIVATE_API_URL}/gourmet-ingredients/${documentId}`, {
    method: 'GET',
    headers: headersInterface(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ingredient with documentId: ${documentId}`);
  }

  const ingredientResponse = await response.json();
  const data = ingredientResponse.data;

  const ingredient: IngredientData = {
    documentId: data.documentId,
    tournament_title: data.tournament_title,
    thumbnail_url: data.thumbnail_url,
    animation_title: data.animation_title,
    info: data.info,
  };

  return ingredient;
}

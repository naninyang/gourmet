export interface InfoItem {
  id: number;
  name: string;
  thumbnail: string;
}

export interface IngredientData {
  documentId: string;
  tournament_title: string;
  thumbnail_url: string;
  animation_title: string;
  info: InfoItem[];
}

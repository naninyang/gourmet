export interface InfoItem {
  documentId: string;
  id: number;
  name: string;
  thumbnail: string;
}

export interface IngredientData {
  documentId: string;
  tournament_title: string;
  animation_title: string;
  info: InfoItem[];
}

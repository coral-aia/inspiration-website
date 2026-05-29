export interface Site {
  id: number;
  name: string;
  url: string;
  description: string;
  category: string;
  screenshotBase64: string;
  createdAt: number;
  isFavorite: boolean;
}

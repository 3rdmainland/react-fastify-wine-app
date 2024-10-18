import { Wine, BestSellingWine } from "../types";

const API_URL = "http://localhost:3000";

export const fetchAllWines = async (): Promise<Wine[]> => {
  const response = await fetch(`${API_URL}/wines`);
  if (!response.ok) {
    throw new Error("Failed to fetch wines");
  }
  return response.json();
};

export const fetchBestSellingWines = async (
  metric: string
): Promise<{ wines: BestSellingWine[]; totalWines: number }> => {
  const response = await fetch(
    `${API_URL}/wines/best-selling?metric=${metric}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch best selling wines");
  }
  return response.json();
};

export interface Wine {
  id: number;
  name: string;
  vintage: number | null;
}

export interface BestSellingWine extends Wine {
  revenue: number;
  bottlesSold: number;
  orderCount: number;
  position: number;
  isTopTen: boolean;
  isBottomTen: boolean;
}

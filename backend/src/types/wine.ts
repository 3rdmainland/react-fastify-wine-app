export interface WineSalesMetrics {
  id: number;
  name: string | null;
  vintage: number | null;
  revenue: number;
  bottlesSold: number;
  orderCount: number;
  position: number;
  isTopTen: boolean;
  isBottomTen: boolean;
}

export type SalesMetric = "revenue" | "bottles" | "orders";

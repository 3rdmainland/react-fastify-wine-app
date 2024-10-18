import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import { SalesMetric, WineSalesMetrics } from "../types/wine";

const prisma = new PrismaClient();

interface BestSellingQuerystring {
  metric?: SalesMetric;
}

export async function wineRoutes(fastify: FastifyInstance) {
  // all wines
  fastify.get("/wines", async () => {
    const wines = await prisma.master_wine.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    return wines;
  });

  // best-selling wines
  fastify.get<{
    Querystring: BestSellingQuerystring;
  }>("/wines/best-selling", async (request) => {
    const { metric = "revenue" } = request.query;
    const validStatuses = ["paid", "dispatched"];

    const orders = await prisma.customer_order.findMany({
      where: {
        status: {
          in: validStatuses,
        },
      },
      include: {
        wine_product: {
          include: {
            master_wine: true,
          },
        },
      },
    });

    // group and aggregate by master wine
    const wineStats = orders.reduce<Record<string, WineSalesMetrics>>(
      (acc, order) => {
        const masterWineId = order.wine_product?.master_wine?.id;
        if (!masterWineId) return acc;

        const masterWine = order.wine_product.master_wine;

        if (!acc[masterWineId]) {
          acc[masterWineId] = {
            id: masterWineId,
            name: masterWine.name,
            vintage: masterWine.vintage,
            revenue: 0,
            bottlesSold: 0,
            orderCount: 0,
            position: 0,
            isTopTen: false,
            isBottomTen: false,
          };
        }

        acc[masterWineId].revenue += Number(order.total_amount || 0);
        acc[masterWineId].bottlesSold += order.quantity || 0;
        acc[masterWineId].orderCount += 1;

        return acc;
      },
      {}
    );

    let sortedWines = Object.values(wineStats);

    switch (metric) {
      case "revenue":
        sortedWines.sort((a, b) => b.revenue - a.revenue);
        break;
      case "bottles":
        sortedWines.sort((a, b) => b.bottlesSold - a.bottlesSold);
        break;
      case "orders":
        sortedWines.sort((a, b) => b.orderCount - a.orderCount);
        break;
    }

    //top & bottom 10% flags
    sortedWines = sortedWines.map((wine, index) => ({
      ...wine,
      position: index + 1,
      isTopTen: index < sortedWines.length * 0.1,
      isBottomTen: index >= sortedWines.length * 0.9,
    }));

    return {
      wines: sortedWines,
      totalWines: sortedWines.length,
    };
  });
}

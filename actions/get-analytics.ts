import { db } from "@/lib/db";
import { Course, Purchase } from "@prisma/client";

type PurchaseWithCourse = Purchase & {
  course: Course;
};

const groupByCourse = (purchases: PurchaseWithCourse[]) => {
  const grouped: { [courseTitle: string]: number } = {};

  purchases.forEach((purchase) => {
    const courseTitle = purchase.course.title;
    if (!grouped[courseTitle]) {
      grouped[courseTitle] = 0;
    }
    grouped[courseTitle] += purchase.course.price!;
  });

  return grouped;
};

const groupByDate = (purchases: PurchaseWithCourse[]) => {
  const grouped: { [date: string]: number } = {};

  purchases.forEach((purchase) => {
    // Format: "12 Jan", "15 Feb" etc. or simpler "YYYY-MM-DD"
    // For simplicity, let's do simple Day/Month grouping.
    // Let's use locale date string for now, grouping by day.
    const date = new Date(purchase.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
    
    if (!grouped[date]) {
      grouped[date] = 0;
    }
    grouped[date] += purchase.course.price!;
  });

  return grouped;
};

export const getAnalytics = async (userId: string) => {
  try {
    const purchases = await db.purchase.findMany({
      where: {
        course: {
          instructorId: userId,
        },
      },
      include: {
        course: true,
      },
      orderBy: {
        createdAt: "asc" // Important for time series order
      }
    });

    const groupedEarnings = groupByCourse(purchases);
    const dataByCourse = Object.entries(groupedEarnings).map(([courseTitle, total]) => ({
      name: courseTitle,
      total: total,
    }));

    const groupedByDate = groupByDate(purchases);
    const dataByDate = Object.entries(groupedByDate).map(([date, total]) => ({
      name: date,
      total: total,
    }));

    const totalRevenue = dataByCourse.reduce((acc, curr) => acc + curr.total, 0);
    const totalSales = purchases.length;

    return {
      dataByCourse,
      dataByDate,
      totalRevenue,
      totalSales,
    };
  } catch (error) {
    console.log("[GET_ANALYTICS]", error);
    return {
      dataByCourse: [],
      dataByDate: [],
      totalRevenue: 0,
      totalSales: 0,
    };
  }
};

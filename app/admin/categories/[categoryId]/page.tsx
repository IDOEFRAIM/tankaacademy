import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { CategoryForm } from "./_components/category-form";

export default async function CategoryIdPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return redirect("/");
  }

  const { categoryId } = await params;

  if (categoryId === "create") {
    return <CategoryForm />;
  }

  const category = await db.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!category) {
    return redirect("/admin/categories");
  }

  return <CategoryForm initialData={category} />;
}

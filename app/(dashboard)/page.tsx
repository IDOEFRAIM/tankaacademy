import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getCourses } from "@/services/courses";
import { Categories } from "@/components/categories";
import { CoursesList } from "@/components/courses-list";
import { SearchInput } from "@/components/search-input";

interface SearchPageProps {
  searchParams: Promise<{
    title: string;
    categoryId: string;
  }>
}

export default async function SearchPage(props: SearchPageProps) {
  const searchParams = await props.searchParams;
  const session = await auth();
  const userId = session?.user?.id;

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc"
    }
  });

  const courses = await getCourses({
    userId: userId || "",
    ...searchParams,
  });

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Categories items={categories} />
        <CoursesList items={courses} />
      </div>
    </>
  );
}

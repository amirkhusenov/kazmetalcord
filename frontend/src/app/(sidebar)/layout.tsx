import { CategorySidebar } from "@/components/CategorySidebar";
import { CategoriesBreadcrumb } from "@/components/CategoriesBreadcrumb";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <CategoriesBreadcrumb/>

      <div className={"site-container py-7 flex gap-7 flex-col lg:grid lg:grid-cols-12"}>
        <CategorySidebar className="w-full hidden lg:block col-span-3"/>
        <div className="col-span-9">
          {children}
        </div>
      </div>
    </>
  );
}

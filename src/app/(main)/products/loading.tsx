import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl space-y-14 px-5 py-10 2xl:max-w-screen-2xl">
      <div className="flex flex-col gap-10 md:flex-row lg:gap-20">
        <div className="h-fit basis-1/2 space-y-5 md:sticky md:top-10">
          <Skeleton className="aspect-square w-full rounded-2xl" />
        </div>
        <div className="basis-1/2 space-y-5">
          <Skeleton className="h-14 w-56" />
          <Skeleton className="h-44 w-full" />
          <Skeleton className="h-10 w-56" />
          <Skeleton className="h-10 w-56" />
          <Skeleton className="h-14 w-full lg:w-96" />
          <Skeleton className="h-44 w-full" />
        </div>
      </div>
    </main>
  );
}

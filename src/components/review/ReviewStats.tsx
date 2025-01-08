"use client";

import { ReviewStatsObject } from "@/wix-api/reviews";
import { StarIcon } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

export default function ReviewStats({
  avgRating,
  ratingByStar,
  totalNumberOfReviews,
}: ReviewStatsObject) {
  const chartData = Object.entries(ratingByStar).map(([star, count]) => ({
    rating: `${star} Stars`,
    reviews: count,
  }));
  const chartConfig = {
    reviews: {
      label: "Reviews",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig;
  return (
    <aside className="space-y-5">
      <div className="space-y-1.5">
        <div className="font-bold">
          <span className="text-3xl">{avgRating}</span>
          <span className="text-base">/5</span>
        </div>
        <div className="flex items-center space-x-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon
              key={i}
              className={cn(
                "size-5 text-[#FDCC0D]",
                i < Math.floor(avgRating) && "fill-[#FDCC0D]",
              )}
            />
          ))}
        </div>
        <p className="text-muted-foreground">
          Based on {totalNumberOfReviews}
          {totalNumberOfReviews === 1 ? " review" : " reviews"}
        </p>
      </div>
      <ChartContainer config={chartConfig}>
        <BarChart
          accessibilityLayer
          data={chartData}
          layout="vertical"
          margin={{
            left: 0,
          }}
        >
          <YAxis
            dataKey="rating"
            type="category"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value}
          />
          <XAxis dataKey="reviews" type="number" hide />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Bar
            dataKey="reviews"
            layout="vertical"
            fill="var(--color-reviews)"
            radius={5}
            background={{ fill: "hsl(var(--muted))", radius: 5 }}
          />
        </BarChart>
      </ChartContainer>
    </aside>
  );
}

export function ReviewStatsLoadingSkeleton() {
  return <Skeleton className="h-80 w-full"></Skeleton>;
}

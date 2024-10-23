import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "w-fit rounded-md bg-red-600 px-[10px] py-1 text-base font-semibold uppercase text-white",
        className,
      )}
    >
      {children}
    </span>
  );
}

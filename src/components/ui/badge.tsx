import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "w-fit rounded-md bg-primary px-[8px] py-1 text-xs font-semibold uppercase text-white sm:px-[10px] sm:text-base",
        className,
      )}
    >
      {children}
    </span>
  );
}

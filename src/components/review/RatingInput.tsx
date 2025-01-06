import { cn } from "@/lib/utils";
import { StarIcon } from "lucide-react";

interface RatingInputProps {
  value: number;
  onChange: (value: number) => void;
}

export default function RatingInput({ value, onChange }: RatingInputProps) {
  const text = ["Poor", "Fair", "Good", "Very Good", "Excellent"];
  return (
    <div className="flex items-center gap-5">
      <div className="flex items-center space-x-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <button key={i} onClick={() => onChange(i + 1)} type="button">
            <StarIcon
              className={cn(
                "size-7 text-[#FDCC0D]",
                i < value && "fill-[#FDCC0D]",
              )}
            />
          </button>
        ))}
      </div>
      <span className="font-medium">{text[value - 1]}</span>
    </div>
  );
}

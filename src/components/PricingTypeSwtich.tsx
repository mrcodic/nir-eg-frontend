import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Switch } from "./ui/switch";

function PricingTypeSwtich({
  type,
  setType,
  className,
}: {
  type: "monthly" | "yearly";
  setType: (type: "monthly" | "yearly") => void;
  className?: string;
}) {
  return (
    <div className={cn("text-center ", className)}>
      <div className=" inline-flex items-center gap-2 rounded-full p-1">
        <div className="relative">
          <button
            className={cn("text-gray-dark font-bold", {
              "text-black": type === "monthly",
            })}
            onClick={() => setType("monthly")}
          >
            شهريا
          </button>

          {type === "monthly" && (
            <div className="bg-secondary h-0.5 w-full absolute" />
          )}
        </div>

        <Switch
          dir="rtl"
          aria-label="Pricing Type switch"
          onCheckedChange={(isChecked) => {
            setType(isChecked ? "yearly" : "monthly");
          }}
          checked={type === "yearly"}
          className="data-[state=checked]:bg-gray-light data-[state=unchecked]:bg-gray-light w-11 cursor-pointer h-6"
          thumbClassName="bg-primary-800 flex items-center justify-center border border-gray-light shrink-0 size-5.5 "
          thumbIcon={<Check className="size-4! stroke-white" />}
        />

        <div className="relative">
          <button
            className={cn("text-gray-dark font-bold", {
              "text-black": type === "yearly",
            })}
            onClick={() => setType("yearly")}
          >
            سنويا
          </button>

          {type === "yearly" && (
            <div className="bg-secondary h-0.5 w-full absolute" />
          )}
        </div>
      </div>
    </div>
  );
}

export default PricingTypeSwtich;

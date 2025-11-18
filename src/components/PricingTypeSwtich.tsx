import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useState } from "react";
import { Switch } from "./ui/switch";

function PricingTypeSwtich() {
  const [type, setType] = useState<"monthly" | "yearly">("monthly");

  return (
    <div className="text-center mb-6">
      <h2 className="text-xl md:text-2xl font-bold ">خطط الأسعار</h2>

      <div className="mt-4 inline-flex items-center gap-2 rounded-full p-1">
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
          onCheckedChange={(isChecked) => {
            console.log(isChecked);
            setType(isChecked ? "yearly" : "monthly");
          }}
          checked={type === "yearly"}
          className="data-[state=checked]:bg-gray-light data-[state=unchecked]:bg-gray-light"
          thumbClassName="bg-primary-800 flex items-center justify-center border border-gray-light shrink-0"
          thumbIcon={<Check className="size-3 stroke-white" />}
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

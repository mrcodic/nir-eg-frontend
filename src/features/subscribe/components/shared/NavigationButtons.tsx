import { Button } from "@/components/ui/button";

function NavigationButtons({
  isLastStep,
  onPrevious,
  isFirstStep,
  isPending,
  pendingText,
  disabledNext,
}: {
  onPrevious?: () => void;
  isLastStep?: boolean;
  isFirstStep?: boolean;
  isPending?: boolean;
  pendingText?: string;
  disabledNext?: boolean;
}) {
  return (
    <div className="flex gap-4 lg:justify-end justify-center pt-6">
      <Button
        type="submit"
        className="w-28 bg-primary-800 hover:bg-primary-800/90"
        disabled={isPending || disabledNext}
      >
        {isPending
          ? pendingText || "جاري الإرسال..."
          : isLastStep
          ? "تأكيد"
          : "التالي"}
      </Button>

      <Button
        type="button"
        variant="outline"
        className="w-28 border-gray-light text-gray-dark hover:bg-gray-dark hover:text-gray-light"
        onClick={!isFirstStep ? onPrevious : undefined}
        disabled={isPending || isFirstStep}
      >
        السابق
      </Button>
    </div>
  );
}

export default NavigationButtons;

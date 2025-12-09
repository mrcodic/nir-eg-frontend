import { Button } from "@/components/ui/button";

function NavigationButtons({
  isLastStep,
  onPrevious,
  isFirstStep,
}: {
  onPrevious?: () => void;
  isLastStep?: boolean;
  isFirstStep?: boolean;
}) {
  return (
    <div className="flex gap-4 lg:justify-end justify-center pt-6">
      <Button
        type="submit"
        className="w-28 bg-primary-800 hover:bg-primary-800/90"
      >
        {isLastStep ? "تأكيد" : "التالي"}
      </Button>

      <Button
        type="button"
        variant="outline"
        className="w-28 border-gray-light"
        onClick={!isFirstStep ? onPrevious : undefined}
      >
        السابق
      </Button>
    </div>
  );
}

export default NavigationButtons;

import { Button } from "@/components/ui/button";
import { getClientPrivateData } from "@/helpers/client-fetch";
import { cn } from "@/lib/utils";
import { pdf } from "@react-pdf/renderer"; // Import pdf for blob generation
import { useState } from "react";
import ExamPDF from "./ExamPdf";

const ExamPDFGenerator = ({
  taskId,
  className,
}: {
  taskId: number | string;
  className?: string;
}) => {
  const [loading, setLoading] = useState(false);
  const [examData, setExamData] = useState(null);

  const handleDownload = async () => {
    if (loading || !taskId) {
      return;
    }

    setLoading(true);

    let data = examData;

    if (!data) {
      try {
        const res = await getClientPrivateData({
          queryKey: [`students/quiz/show/answers/${taskId}`],
        });
        data = res.body;
        setExamData(data); // Cache the data for potential future clicks
      } catch (err) {
        setLoading(false);
        return; // Optionally handle error (e.g., show toast)
      }
    }

    try {
      // Generate PDF blob
      const pdfInstance = pdf(<ExamPDF examData={data} />);
      const blob = await pdfInstance.toBlob();

      // Create download link and trigger click
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `TASK-${taskId}-${new Date().toDateString()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      // Optionally handle PDF generation error
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      className={cn("h-11 w-full font-bold [&>svg]:size-5", className)}
      variant="secondary"
      onClick={handleDownload}
      disabled={loading}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          جارى التهيئة
        </span>
      ) : (
        "تنزيل نموذج الإجابة PDF"
      )}
    </Button>
  );
};

export default ExamPDFGenerator;

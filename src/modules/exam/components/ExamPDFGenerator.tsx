"use client";

import { Button } from "@/components/ui/button";
import { getClientPrivateData } from "@/helpers/fetchers/client-fetch";
import { cn } from "@/lib/utils";
import {
  TaskShowAnswersData,
  TaskShowAnswersResponse,
} from "@/types/quiz.types";
import { pdf } from "@react-pdf/renderer";
import { useState } from "react";
import ExamPDF from "./ExamPdf";

const ExamPDFGenerator = ({
  taskId,
  text,
  className,
}: {
  taskId: number | string;
  text?: string;
  className?: string;
}) => {
  const [loading, setLoading] = useState(false);
  const [examData, setExamData] = useState<TaskShowAnswersData | null>(null);

  const handleDownload = async () => {
    if (loading || !taskId) return;

    setLoading(true);

    let data = examData;

    if (!data) {
      try {
        const res = await getClientPrivateData<TaskShowAnswersResponse>({
          queryKey: [`students/quiz/show/answers/${taskId}`],
        });

        data = res?.body ? { ...res.body, solution: true } : null;
        setExamData(data);
      } catch {
        setLoading(false);
        return;
      }
    }

    if (!data) {
      setLoading(false);
      return;
    }

    try {
      const pdfInstance = pdf(<ExamPDF examData={data} />);
      const blob = await pdfInstance.toBlob();

      const fileName = `TASK-${taskId}-${new Date().toDateString()}.pdf`;

      if (typeof window !== "undefined" && window.electron?.savePDF) {
        const buffer = await blob.arrayBuffer();

        window.electron.savePDF(buffer, fileName);
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");

        a.href = url;
        a.download = fileName;
        a.click();

        URL.revokeObjectURL(url);
      }
    } catch {
      // ممكن تضيف toast error هنا لو حابب
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
            />

            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>

          جارى التهيئة
        </span>
      ) : (
        text || "تنزيل نموذج الإجابة PDF"
      )}
    </Button>
  );
};

export default ExamPDFGenerator;
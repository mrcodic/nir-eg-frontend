import CopyButton from "@/components/CopyButton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TenantProgress } from "@/types/building.types";
import Link from "next/link";
import { useState } from "react";

function CompletedBuildingUI({ data }: { data: TenantProgress }) {
  const [lastSavedEmail] = useState(
    typeof window !== "undefined"
      ? localStorage.getItem("last_tenant_email") || ""
      : "",
  );

  return (
    <div className="flex flex-col text-start mt-6">
      <h2 className="font-bold ">
        يمكنك الذهاب إلى لوحة التحكم الخاصة بك وتسجيل الدخول باستخدام البريد
        الإلكتروني وكلمة المرور التي قمت بالتسجيل بها معنا.
      </h2>

      <DataValue
        title="رابط لوحة التحكم:"
        value={data?.domains?.admin}
        className="mt-4"
        copyable
      />
      <DataValue
        title="البريد الإلكتروني:"
        value={lastSavedEmail || ""}
        className="mt-4"
      />

      {/* <div className="flex items-center gap-x-6 gap-y-1 flex-wrap mt-4">
        <DataValue
          title="كلمة السر:"
          value={"*************"}
          valueClassName="no-underline"
        />

        <span className="text-sm font-bold text-gray-dark">
          كلمة السر التي قمت باستخدامها عند التسجيل
        </span>
      </div> */}

      <div className="w-full flex items-center justify-between gap-x-2 gap-y-1 mt-6">
        <p className="font-bold">
          أو يمكنك الذهاب للصفحة الرئيسية الخاصة بمنصتك من خلال الرابط التالي:
        </p>
        {data?.domains?.public && (
          <div className="flex items-center gap-2">
            <Link
              href={`${data?.domains?.public}`}
              className="text-primary-800 underline font-bold"
            >
              {data?.domains?.public}
            </Link>
            <CopyButton value={data?.domains?.public} />
          </div>
        )}
      </div>

      <p className="font-bold mt-4">
        الصفحة الرئيسية هي أول صفحة تظهر للطلاب عند دخولهم إلى المنصة قبل إنشاء
        حساب أو تسجيل الدخول.
      </p>

      <div className="mt-8 flex gap-4 w-full justify-center flex-wrap">
        <a
          href={data?.domains?.admin}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button className="font-bold max-w-[165px] w-full">
            لوحة التحكم
          </Button>
        </a>

        <a
          href={data?.domains?.public}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            className="font-bold max-w-[165px] w-full"
            variant="outline-gray"
          >
            الصفحة الرئيسية
          </Button>
        </a>
      </div>
    </div>
  );
}

export default CompletedBuildingUI;

const DataValue = ({
  title,
  value,
  valueClassName,
  className,
  copyable = false,
}: {
  title: string;
  value: string | undefined;
  valueClassName?: string;
  className?: string;
  copyable?: boolean;
}) => {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <span className="font-bold">{title}</span>
      <span
        className={cn("font-bold text-primary-800 underline", valueClassName)}
      >
        {value}
      </span>
      {copyable && value && <CopyButton value={value} />}
    </div>
  );
};

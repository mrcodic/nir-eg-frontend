import AuthLayout from "@/layouts/AuthLayout";

export default function DesktopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthLayout className="mt-0">{children}</AuthLayout>;
}

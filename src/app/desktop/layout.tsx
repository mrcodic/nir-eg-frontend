import AuthLayout from "@/layouts/AuthLayout";
import DesktopProviders from "./DesktopProviders";

export default function DesktopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DesktopProviders>
      <AuthLayout className="mt-0">{children}</AuthLayout>
    </DesktopProviders>
  );
}

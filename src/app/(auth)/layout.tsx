import AuthLayout from "@/layouts/AuthLayout";

function layout({ children }) {
  return <AuthLayout img={"/assets/signin5.png"}>{children}</AuthLayout>;
}

export default layout;

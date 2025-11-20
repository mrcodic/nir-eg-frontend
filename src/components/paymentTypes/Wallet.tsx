import WalletPay from "../forms/WalletPay";

export default function Wallet({ data }) {
  return (
    <>
      {" "}
      <div
        style={{
          boxShadow: "0px 2px 10px 4px rgba(157,130,66,0.20)",
        }}
        className="mt-[56px] rounded-lg border py-[32px] px-10 md:px-[40px] border-primary"
      >
        <WalletPay
          gradeId={data?.body?.grade?.id}
          id={data?.body?.id}
          label="رقم المحفظة"
        />
      </div>
    </>
  );
}

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

/**
 * PaymentResult client component
 * - Reads search params from the current URL
 * - Detects success/fail via `payment` param (example: payment=success)
 * - Renders a simple, friendly UI showing key fields from the payment gateway
 * - Note: signature verification should happen on the server — this component only displays results
 */

export default function PaymentResultClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const params = useMemo(() => {
    if (!searchParams) return null;

    const pairs = {} as Record<string, string>;
    for (const key of Array.from(searchParams.keys())) {
      const value = searchParams.get(key) ?? "";
      try {
        // decode any percent-encoded Arabic or spaces etc.
        pairs[key] = decodeURIComponent(value);
      } catch (e) {
        pairs[key] = value;
      }
    }
    return pairs;
  }, [searchParams]);

  if (!params) return null; // progressively hydrated

  const isSuccess = (params.payment || "").toLowerCase() === "success";

  // friendly displayed fields
  const reference = params.referenceNumber || params.merchantRefNumber || "-";
  const orderAmount = params.orderAmount || params.paymentAmount || "-";
  const status =
    params.orderStatus || params.statusDescription || params.statusCode || "-";
  const customer = params.customerName || "-";
  const method = params.paymentMethodName || params.paymentMethod || "-";
  const merchantRef = params.merchantRefNumber || "-";
  const signature = params.signature || "-";

  // parse expirationTime if present
  let expiration: string | null = null;
  if (params.expirationTime) {
    const n = Number(params.expirationTime);
    if (!Number.isNaN(n)) expiration = new Date(n).toLocaleString();
  }

  return (
    <div className="max-w-3xl mx-auto my-8 p-6 bg-white rounded-2xl shadow-md">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">
          Payment {isSuccess ? "Success" : "Result"}
        </h1>
        <div
          className={`px-3 py-1 rounded-full text-sm ${
            isSuccess
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {isSuccess ? "Success" : "Failure / Pending"}
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Detail label="Reference" value={reference} />
        <Detail label="Order / Payment Amount" value={`${orderAmount}`} />
        <Detail label="Status" value={status} />
        <Detail label="Payment Method" value={method} />
        <Detail label="Customer" value={customer} />
        <Detail label="Merchant Ref" value={merchantRef} />
        {expiration && <Detail label="Expiration" value={expiration} />}
      </section>

      <div className="mb-6">
        <h2 className="text-lg font-medium mb-2">Raw params</h2>
        <pre className="text-sm p-3 bg-gray-50 rounded-md overflow-auto max-h-48">
          {JSON.stringify(params, null, 2)}
        </pre>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50"
        >
          Go home
        </button>

        <button
          onClick={() => {
            // go to order page if merchantRef contains book or order id pattern
            if (merchantRef && merchantRef.includes("book-")) {
              // try to extract id
              const m = merchantRef.match(/book-(\d+)/);
              if (m) return router.push(`/books/${m[1]}`);
            }
            // fallback: push to orders list
            router.push(`/orders?ref=${encodeURIComponent(reference)}`);
          }}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:opacity-95"
        >
          View order
        </button>

        <button
          onClick={() => navigator.clipboard?.writeText(window.location.href)}
          className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50"
        >
          Copy current URL
        </button>
      </div>

      <footer className="mt-6 text-xs text-gray-500">
        <p>
          Important: verify the signature server-side before granting access or
          marking order as paid.
        </p>
        <p>
          If you want, send me your server secret and I can show a server
          endpoint example (don&apos;t paste secrets in public chat).
        </p>
      </footer>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="mt-1 font-medium wrap-break-word">{value}</div>
    </div>
  );
}

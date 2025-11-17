"use server";

import { ContactFormValues, contactSchema } from "@/lib/schemas/contact.schema";

export default async function submitContact(formData: FormData) {
  "use server";

  const entries = Object.fromEntries(formData);
  const result = contactSchema.safeParse(entries);

  if (!result.success) {
    throw new Error("Validation failed on server");
  }

  const payload: ContactFormValues = result.data;

  // TODO: persist to DB / send email / enqueue job
  // Example (server-side logging)
  console.log("New contact submission:", payload);

  // Optionally: return a small success payload to the client
  return { ok: true, message: "تم إرسال النموذج بنجاح" };
}

"use server";

import { ContactFormValues, contactSchema } from "@/lib/schemas/contact.schema";

const URL = process.env.NEXT_PUBLIC_BASE_URL;

export default async function submitContact(formData: FormData) {
  const entries = Object.fromEntries(formData);
  const result = contactSchema.safeParse(entries);

  if (!result.success) {
    return { ok: false, message: "Validation failed on server" };
  }

  try {
    const payload: ContactFormValues = result.data;

    const res = await fetch(`${URL}/message`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const error = await res.json();
      return {
        ok: false,
        message: error?.message || "حدث خطاء اثناء ارسال النموذج",
        errors: error?.errors || [],
      };
    }

    // Optionally: return a small success payload to the client
    return { ok: true, message: "تم إرسال النموذج بنجاح" };
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return {
      ok: false,
      message: "حدث خطاء اثناء ارسال النموذج",
      errors: [],
    };
  }
}

// {
//     "message": "The name field is required. (and 1 more error)",
//     "errors": {
//         "name": [
//             "The name field is required."
//         ],
//         "email": [
//             "The email field is required."
//         ]
//     }
// }

import { paymentStatus, paymentType } from "@/types";

export const paymentTypesBooks = [
  {
    value: paymentType.fawerypay,
    icons: ["/assets/Fawry.svg"],
    soon: true,
    filter: "hide_fawry",
  },
  // {
  //   value: paymentType.visa,
  //   icons: ["/assets/visa.svg"],
  //   soon: true,
  //   filter: "hide_visa",
  // },
  // {
  //   label: "محفظة إلكترونية",
  //   value: paymentType.wallet,
  //   icons: ["/assets/wallet.svg"],
  //   soon: true,
  //   filter: "hide_payment_code",
  // },
];

export const paymentTypesOnline = [
  {
    value: paymentType.fawerypay,
    icons: ["/assets/Fawry.svg"],
    soon: true,
    filter: "hide_fawry",
  },
  {
    value: paymentType.visa,
    icons: ["/assets/visa.svg"],
    soon: true,
    filter: "hide_visa",
  },
  {
    label: "محفظة إلكترونية",
    value: paymentType.wallet,
    icons: ["/assets/wallet.svg"],
    soon: true,
    filter: "hide_payment_code",
  },
  // {
  //   value: paymentType.aman,
  //   icons: ["/assets/aman.svg", "/assets/aman1.svg"],
  // },
  // { value: paymentType.visa, icons: ["/assets/visa.svg"] },
  // {
  //   label: "محفظة إلكترونية",
  //   value: paymentType.wallet,
  //   icons: ["/assets/wallet.svg"],
  // },
  // { label: " كود", value: paymentType.code, icons: ["/assets/payCode.svg"] },
];

export const paymentTypesCenter = [
  {
    label: " شراء  عن طريق كود",
    value: paymentType.code,
    icons: ["/assets/payCode.svg"],
    soon: false,
  },
];

export const paymentTypesObj = {
  // [paymentType.aman]: {
  //   value: paymentType.aman,
  //   icons: ["/assets/aman.svg", "/assets/aman1.svg"],
  // },
  [paymentType.fawerypay]: {
    value: paymentType.fawerypay,
    icons: ["/assets/Fawry.svg"],
  },
  [paymentType.visa]: {
    value: paymentType.visa,
    icons: ["/assets/visa.svg"],
  },
  MasterCard: {
    value: paymentType.visa,
    icons: ["/assets/visa.svg"],
  },
  Visa: {
    value: paymentType.visa,
    icons: ["/assets/visa.svg"],
  },
  [paymentType.wallet]: {
    label: "محفظة إلكترونية",
    value: paymentType.wallet,
    icons: ["/assets/wallet.svg"],
  },
  [paymentType.code]: {
    label: " شراء  عن طريق كود",
    value: paymentType.code,
    icons: ["/assets/payCode.svg"],
  },
  COUPON: {
    label: " شراء  عن طريق كود",
    value: paymentType.code,
    icons: ["/assets/payCode.svg"],
  },
  FREE: {
    label: "مجانيه",
    value: "FREE",
    icons: ["/assets/heart.svg"],
  },
};

export const paymentStatusArabic = {
  [paymentStatus.pending]: "قيد الانتظار",
  [paymentStatus.failed]: "لم يتم تنفيذ العملية",
  [paymentStatus.unpaid]: "غير مدفوع",
  [paymentStatus.paid]: "تم الدفع ",
  default: "غير محدد",
};

export const arabicOrdinalMap: Record<number, string> = {
  1: "الأول",
  2: "الثاني",
  3: "الثالث",
  4: "الرابع",
  5: "الخامس",
  6: "السادس",
  7: "السابع",
  8: "الثامن",
  9: "التاسع",
  10: "العاشر",
  11: "الحادي عشر",
  12: "الثاني عشر",
  13: "الثالث عشر",
  14: "الرابع عشر",
  15: "الخامس عشر",
  16: "السادس عشر",
  17: "السابع عشر",
  18: "الثامن عشر",
  19: "التاسع عشر",
  20: "العشرون",
  30: "الثلاثون",
  40: "الأربعون",
  50: "الخمسون",
  60: "الستون",
  70: "السبعون",
  80: "الثمانون",
  90: "التسعون",
  100: "المائة",
};

export const deliveryStatusArabic = {
  pending: "قيد الانتظار",
  with_shipping: "قيد التوصيل",
  received: "تم التوصيل",
};

export const OTP_SEND_TIME_KEY = "otp_send_time";
export const COOLDOWN_DURATION = 60;
export const RESET_PASSWORD_OTP_GATE_KEY = "reset_password_otp_gate";
export const RESET_PASSWORD_OTP_GATE_TTL_MS = 5 * 60 * 1000;

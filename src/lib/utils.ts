import {
  arabicOrdinalMap,
  COOLDOWN_DURATION,
  OTP_SEND_TIME_KEY,
} from "@/constants";
import { arabCountries } from "@/constants/arabCountries";
import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        "text-32",
        "text-28",
        "text-40",
        "size-28",
        "size-32",
        "size-40",
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}

export const numberToArabicOrdinal = (num: number): string => {
  if (num <= 20) return arabicOrdinalMap[num] || num.toString();

  if (num < 100) {
    const units = num % 10;
    const tens = Math.floor(num / 10) * 10;

    if (units === 0) return arabicOrdinalMap[tens];

    return `${tens && units === 1 ? "الواحد" : arabicOrdinalMap[units]} و${
      arabicOrdinalMap[tens]
    }`;
  }

  return num.toString();
};

export const getInitialExpiryTime = () => {
  if (typeof window == "undefined") return new Date();

  const otpSendTime = localStorage.getItem(OTP_SEND_TIME_KEY);

  if (otpSendTime) {
    const sendTimestamp = parseInt(otpSendTime);
    const currentTime = Date.now();

    if (sendTimestamp < currentTime) {
      localStorage.removeItem(OTP_SEND_TIME_KEY);
      return new Date();
    } else {
      return new Date(sendTimestamp);
    }
  }

  return new Date();
};

export const isOtpExpired = () => {
  const otpSendTime = getInitialExpiryTime();

  return { otpSendTime, isExpired: otpSendTime.getTime() < Date.now() + 1000 };
};

export const setNewOtpSendTime = ({
  customDuration,
}: {
  customDuration?: number;
} = {}) => {
  const newTime = new Date();
  newTime.setSeconds(
    newTime.getSeconds() + (customDuration || COOLDOWN_DURATION),
  );

  localStorage.setItem(OTP_SEND_TIME_KEY, newTime.getTime().toString());
  return newTime;
};

interface Answer {
  correct?: boolean;
  selected?: boolean;
}

export const getAnswerState = (answer?: Answer) => {
  if (!answer) return "unanswered";

  const hasSelectedKey = "selected" in answer;

  if (!hasSelectedKey) return "unanswered";

  const isSelected = answer.selected === true;
  const isCorrect = answer.correct === true;

  if (isCorrect && isSelected) return "correct-selected";

  if (isCorrect && !isSelected) return "correct-unselected";

  if (!isCorrect && isSelected) return "incorrect-selected";

  return "unanswered";
};

export const isQuestionCorrect = (question: any): boolean => {
  const answers = question?.answers || [];

  let selectedCorrectCount = 0;
  let totalCorrectCount = 0;
  let hasIncorrectSelection = false;
  let hasUnanswered = false;

  for (const answer of answers) {
    const state = getAnswerState(answer);

    if (answer.correct) {
      totalCorrectCount++;
    }

    if (state === "correct-selected") {
      selectedCorrectCount++;
    } else if (state === "incorrect-selected") {
      hasIncorrectSelection = true;
      break;
    } else if (state === "correct-unselected") {
      hasUnanswered = true;
    } else if (state === "unanswered" && answer.correct) {
      hasUnanswered = true;
    }
  }

  if (hasIncorrectSelection) return false;

  if (question.has_multi_correct) {
    return selectedCorrectCount === totalCorrectCount && !hasUnanswered;
  }

  return (
    selectedCorrectCount === 1 && selectedCorrectCount === totalCorrectCount
  );
};

export const isParagraphCorrect = (paragraphQuestion: any): boolean => {
  if (paragraphQuestion?.type !== 2) {
    throw new Error("This function only handles paragraph questions (type 2)");
  }

  const relatedQuestions = paragraphQuestion?.related_questions || [];

  if (relatedQuestions.length === 0) return false;

  for (const question of relatedQuestions) {
    if (!isQuestionCorrect(question)) {
      return false;
    }
  }

  return true;
};

export const formatCurrency = (amount: number | string): string => {
  const modifiedPrice = isFinite(Number(amount)) ? Number(amount) : 0;
  const hasFraction = modifiedPrice % 1 !== 0;

  const formatted = modifiedPrice.toLocaleString("en-US", {
    style: "currency",
    currency: "EGP",
    currencyDisplay: "code",
    minimumFractionDigits: hasFraction ? 2 : 0,
    maximumFractionDigits: hasFraction ? 2 : 0,
  });

  const withoutCode = formatted.replace("EGP", "").trim();

  return `${withoutCode} جنيه`;
};

export const getPhoneInfoFromCode = (code: string | number) => {
  if (!code) return { code: "+20", isoCode: "EG" };

  // check if code start with +
  const cleanCode = code.toString().replace("+", "");

  const isoCode =
    arabCountries.find((c) => c.countryCallingCodes?.[0] === "+" + cleanCode)
      ?.alpha2 || "";

  return {
    code: "+" + cleanCode,
    isoCode,
  };
};

export const presistUserPhone = (phone: string, countryCallingCode: string) => {
  localStorage.setItem("phone", phone);
  localStorage.setItem("phone_code", countryCallingCode);
};

export const getUserPhoneFromStorage = () => {
  if (typeof window == "undefined")
    return { phone: "", phone_code: "+20", phone_iso: "EG" };

  return {
    phone: localStorage.getItem("phone") || "",
    phone_code: localStorage.getItem("phone_code") || "+20",
    phone_iso:
      getPhoneInfoFromCode(localStorage.getItem("phone_code"))?.isoCode || "EG",
  };
};

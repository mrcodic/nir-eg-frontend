import Cookies from "js-cookie";

export const removeCookies = (key: string | string[]) => {
  if (typeof window !== "undefined") {
    if (Array.isArray(key)) {
      key.forEach((k) => {
        Cookies.remove(k);
      });
    } else {
    }
  }
};

export function errorHandler(obj: any) {
  if (!obj) return null;

  const keys = Object?.keys(obj);
  let text = "";

  keys.forEach((key) => {
    text += obj[key][0];
  });

  return text;
}

import Cookies from "js-cookie";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export const clientGetErrorhandler = (error) => {
  if (isRedirectError(error)) {
    console.log("redirect error in getClientPrivateData  ");
    throw error;
  }

  if (error.response?.status === 429 || error?.status === 429) {
    console.log("too many requests error : ", error);
    if (window.location.pathname !== "/ErrorPage") {
      window.location.href =
        "/ErrorPage?message=لقد تجاوزت الحد المسموح به من الطلبات";
    }
  }

  if (error.response?.status === 307 && error.response?.data?.shouldRedirect) {
    console.log("custom redirect error in getClientPrivateData : ", error);
    if (window.location.pathname !== error.response.data.redirectUrl) {
      window.location.href = error.response.data.redirectUrl;
    }

    if (error.response.data.redirectUrl === "/login") {
      Cookies.remove("nir_token");
    }
  } else if (error.response.data?.code === 403) {
    console.log("403 error in getClientPrivateData ");

    if (window.location.pathname !== "/unAuth") {
      window.location.href = "/unAuth";
    }
  } else if (error.status === 403) {
    console.log("403 2 error in getClientPrivateData ");

    if (window.location.pathname !== "/unAuth") {
      window.location.href = "/unAuthCenter";
    }
  } else if (error.status == 401) {
    console.log("401 error in getClientPrivateData ");

    Cookies.remove("nir_token");
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  } else {
    console.log("other error in getClientPrivateData ", error);
    // await handleServerError(error);
    throw error;
  }
};

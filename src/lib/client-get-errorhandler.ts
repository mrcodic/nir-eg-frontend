import Cookies from "js-cookie";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export const clientGetErrorhandler = (error) => {
  if (isRedirectError(error)) {
    console.log("redirect error in getDataClient  ");
    throw error;
  }

  if (error.response?.status === 307 && error.response?.data?.shouldRedirect) {
    console.log("custom redirect error in getDataClient : ", error);
    if (window.location.pathname !== error.response.data.redirectUrl) {
      window.location.href = error.response.data.redirectUrl;
    }

    if (error.response.data.redirectUrl === "/login") {
      Cookies.remove("auth_token");
    }
  } else if (error.response.data?.code === 403) {
    console.log("403 error in getDataClient ");

    if (window.location.pathname !== "/unAuth") {
      window.location.href = "/unAuth";
    }
  } else if (error.status === 403) {
    console.log("403 2 error in getDataClient ");

    if (window.location.pathname !== "/unAuth") {
      window.location.href = "/unAuthCenter";
    }
  } else if (error.status == 401) {
    console.log("401 error in getDataClient ");

    Cookies.remove("auth_token");
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  } else {
    console.log("other error in getDataClient ", error);
    // await handleServerError(error);
    throw error;
  }
};

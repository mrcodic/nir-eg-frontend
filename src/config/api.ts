"use server";

import axios from "axios";
import { revalidateTag } from "next/cache";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export const instance = axios.create({
  baseURL: process.env.BASE_URL,
  withCredentials: true,
});

export const saveCookie = async (key: string, value: string) => {
  const cookieStore = await cookies();
  cookieStore.set(key, value);
};

export const getStudentIdCookie = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("stdId")?.value || null;
};
export const deleteStudentIdCookie = async () => {
  const cookieStore = await cookies();
  return cookieStore.delete("stdId");
};

export const getCookie = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("penguin_user_token")?.value || null;
};

export const getDeviceCode = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("device_code")?.value || null;
};

export const deleteCookie = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("penguin_user_token");
  cookieStore.delete("stdId");
  cookieStore.delete("type");
};

export const revalidateData = async (tags: string) => {
  if (tags.includes(",")) {
    const tagsArray = tags.split(",");
    tagsArray.forEach((tag) => {
      revalidateTag(tag);
    });
  } else {
    revalidateTag(tags);
  }

  return null;
};

export const postData = async ([endpoint, data, method = "post"]: [
  string,
  unknown,
  string?
]) => {
  try {
    const token = await getCookie();
    const headersList = await headers();

    const response = await instance.request({
      url: endpoint,
      method,
      data,
      withCredentials: true,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        Cookie: headersList.get("cookie"),
      },
    });

    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await deleteCookie();
  } catch (e) {
    console.log(e);
  }
  redirect("/login");
};

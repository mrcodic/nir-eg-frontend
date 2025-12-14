"use server";

import axios from "axios";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export const instance = axios.create({
  baseURL: process.env.BASE_URL,
  withCredentials: true,
});

export const saveCookie = async (key: string, value: string) => {
  const cookieStore = await cookies();
  cookieStore.set(key, value);
};

export const getCookie = async (name: string) => {
  const cookieStore = await cookies();
  return cookieStore.get(name)?.value || null;
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

"use client";

import Image from "next/image";
import MotionWrapper from "../MotionWrapper";
import ContactUsForm from "../form/ContactUsForm";

export default function ContactUsSection() {
  return (
    <MotionWrapper
      className="wrapper "
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ amount: 0.4, once: true }}
    >
      <div className="section bg-[url('/bg-vector.png')] p-4 bg-background rounded-lg flex max-lg:flex-col-reverse relative gap-y-8">
        <div className="bg-white w-1/2 max-lg:w-full rounded-lg shadow-sm p-6">
          <ContactUsForm />
        </div>

        <div className=" lg:w-1/2 flex flex-col justify-center px-8  rounded-lg">
          <Image
            src="/logo.svg"
            alt="logo"
            className="mb-10"
            width={144}
            height={61}
          />
          <h2 className="text-3xl font-bold mb-4">تواصل معنا لمعرفة المزيد</h2>

          <p className="text-gray-dark font-bold text-xl">
            تواصل معنا و سنقوم بالرد عليك
          </p>

          <Image
            src="/assets/lightbulb.png"
            alt="light bulbs"
            className="aspect-square max-w-full mx-auto max-lg:hidden"
            width={334}
            height={334}
          />
        </div>
      </div>
    </MotionWrapper>
  );
}

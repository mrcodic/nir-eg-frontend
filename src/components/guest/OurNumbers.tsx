import Image from "next/image";

const numbers = [
  {
    icon: "/assets/subscribe-3d.png",
    count: "1000",
    title: "اشتراك",
  },
  {
    icon: "/assets/graduation.png",
    count: "1000",
    title: "طالب",
  },
  {
    icon: "/assets/course.png",
    count: "1000",
    title: "حصة",
  },
];

function OurNumbers() {
  return (
    <section>
      <div className="flex justify-center">
        <h2 className="font-bold text-28">أرقامنا</h2>
      </div>

      <div className="bg-background mt-8 md:py-8 py-6 md:px-6 px-4 rounded-lg grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6">
        {numbers.map((number) => (
          <div className="flex items-center gap-4 border border-secondary rounded-lg md:p-4 p-2">
            <Image
              src={number.icon}
              width={96}
              height={96}
              className="md:size-24 size-16"
              alt={number.title}
            />
            <div>
              <h2 className="font-bold md:text-40 text-3xl">{number.count}</h2>
              <p className="md:text-2xl text-xl font-bold">{number.title}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default OurNumbers;

const ReadingBorder = ({ text }: { text: string }) => {
  return (
    <div className="flex items-center gap-4">
      <div className="h-px w-full bg-gray-light my-[24px]" />
      <div className="relative text-primary flex items-center text-[20px] whitespace-nowrap">
        <h3
          style={{
            WebkitTextFillColor: "white",
            WebkitTextStrokeWidth: 1,
            WebkitTextStrokeColor: "#d9b45c",
          }}
          className="textStroke text-[20px] absolute flex items-center -top-[2px] z-0!"
        >
          {text}
        </h3>
        <span className="relative z-10">{text}</span>
      </div>
      <div className="h-px bg-gray-light w-full my-[24px]" />
    </div>
  );
};

export default ReadingBorder;

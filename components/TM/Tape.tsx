import React, { useEffect, useRef, useState } from "react";

const Tape = ({
  tape,
  className,
}: {
  tape: { tape: string[]; pointer: number };
  className?: string;
}) => {
  const [autoScrollOn, setAutoScrollOn] = useState(false);

  return (
    <div className="absolute  border-2 border-accent-focus  mt-2 rounded-md bg-base-200 h-20 px-4 flex flex-col items-center justify-start  scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-base-20 z-20">
      <div className="text-lg flex items-center text-base-content  tracking-wider">
        Tape <span className="text-xs ml-4 mr-2">Auto Scroll</span>
        <input
          type="checkbox"
          className="toggle toggle-xs"
          checked={autoScrollOn}
          onChange={() => setAutoScrollOn((v) => !v)}
        />
      </div>
      <div
        className={` flex justify-start   h-full w-full overflow-x-auto max-w-sm sm:max-w-sm lg:max-w-2xl px-6  ${className}`}
      >
        {tape.tape.map((el, idx) => (
          <Pointer
            key={idx}
            isPointer={idx == tape.pointer}
            text={el}
            autoScrollOn={autoScrollOn}
          />
        ))}
      </div>
    </div>
  );
};

const Pointer = ({
  text,
  isPointer,
  autoScrollOn,
}: {
  text: string;
  isPointer: boolean;
  autoScrollOn: boolean;
}) => {
  const pointerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isPointer && autoScrollOn)
      pointerRef.current.scrollIntoView({
        inline: "nearest",
        behavior: "auto",
        block: "center",
      });
  });

  return (
    <div
      ref={pointerRef}
      className={`text-xs h-full  border-2 flex items-center px-2 border-transparent ${
        isPointer ? "border-green-500 text-green-600 font-bold" : ""
      }`}
    >
      {text}
    </div>
  );
};

export default Tape;

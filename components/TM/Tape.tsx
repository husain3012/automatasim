import React from "react";

const Tape = ({
  tape,
  tapeHead,
  className,
}: {
    tape: string[];
    tapeHead: number;
  className?: string;
}) => {
  let tapeGapMultiplier = 20;
  // if stack height is greater than window height, decrease gap multiplier to fit in window
  if (
    typeof window !== "undefined" &&
    tape.length * tapeGapMultiplier > window.innerWidth / 1.5
  ) {
    tapeGapMultiplier = window.innerWidth / 1.5 / tape.length + 0.5;
  }

  return (
    <ul
      className={`border-b-2 border-x-2  absolute flex border-accent bg-primary ${className}`}
    >
      
      {tape.map((el, idx) => (
        <div
          key={idx}
          style={{
            marginRight: 0 - idx * tapeGapMultiplier + "px",
            zIndex: idx,
          }}
          className={`border-base-300 ${idx==tapeHead?"border-green-400":""} border-2 `}
        >
          <div className="card-body">{el}</div>
        </div>
      ))}
    </ul>
  );
};

export default Tape;

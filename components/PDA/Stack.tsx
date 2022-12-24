import React from "react";

const Stack = ({
  stack,
  className,
}: {
  stack: string[];
  className?: string;
}) => {
  let stackGapMultiplier = 20;
  // if stack height is greater than window height, decrease gap multiplier to fit in window
  if (
    typeof window !== "undefined" &&
    stack.length * stackGapMultiplier > window.innerHeight / 1.5
  ) {
    stackGapMultiplier = window.innerHeight / 1.5 / stack.length + 0.5;
  }

  return (
    <ul
      className={`border-b-2 border-x-2  relative flex justify-center border-accent ${className}`}
    >
      {/* <audio
        // controls
        autoPlay
        src="/sounds/bubble.mp3"
      >
        Your browser does not support the
        <code>audio</code> element.
      </audio> */}
      {stack.map((el, idx) => (
        <div
          key={idx}
          style={{
            marginTop: 0 - idx * stackGapMultiplier + "px",
            zIndex: idx,
          }}
          className={`skew-x-6 shadow-xl absolute grid w-16 h-12 border-b-2 rounded border-base-100 text-primary-content place-content-center bg-primary cursor-pointer hover:translate-y-8 hover:translate-x-2 hover:skew-x-12 transition-all hover:bg-primary-focus `}
        >
          <div className="card-body">{el}</div>
        </div>
      ))}
    </ul>
  );
};

export default Stack;

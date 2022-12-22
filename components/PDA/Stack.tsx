import React, { useEffect } from "react";
import useSound from "use-sound";



const Stack = ({
  stack,
  className,
}: {
  stack: string[];
  className?: string;
}) => {
 
 

  // const reversed = [...stack].reverse();
  return (
    <ul
      className={`border-b-2 border-x-2  relative flex justify-center border-accent ${className}`}
    >
      <audio
        // controls
        autoPlay
        src="/sounds/bubble.mp3"
      >
        Your browser does not support the
        <code>audio</code> element.
      </audio>
      {stack.map((el, idx) => (
        <div
          key={idx}
          style={{
            marginTop: 0 - idx * 2 + "rem",
            zIndex: idx,
          }}
          className={`skew-x-6 shadow-xl absolute grid w-16 h-12 border-b-2 rounded border-base-100 text-primary-content place-content-center bg-primary `}
        >
          <div className="card-body">{el}</div>
        </div>
      ))}
    </ul>
  );
};

export default Stack;

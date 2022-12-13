import React, { useEffect, useState } from "react";
import ControlPanel from "./ControlPanel";
import Canvas from "./Canvas";
import useDFA from "../../hooks/useDFA";

const DFA = () => {
  const dfa = useDFA();

  return (
    <div className="flex flex-col sm:flex-row  w-screen h-[80vh]">
      <div className="h-full  w-full sm:w-3/5  p-2">
        <Canvas dfa={dfa} />
      </div>
      <div className="divider divider-horizontal"></div>
      <div className="h-full p-2">
        <ControlPanel dfa={dfa} />
      </div>
    </div>
  );
};

export default DFA;

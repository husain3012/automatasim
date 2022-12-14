import React, { useEffect, useState } from "react";
import ControlPanel from "./ControlPanel";
import Canvas from "./Canvas";
import useDFA from "../../hooks/useDFA";

const DFA = () => {
  const dfa = useDFA();
  const [activeEdge, setActiveEdge] = useState(null);

  return (
    <div className="flex flex-col sm:flex-row  w-screen h-[80vh]">
      <div className="h-[30vh] sm:h-full   w-full sm:w-3/5  p-2">
        <Canvas dfa={dfa} activeEdge={activeEdge} />
      </div>
      <div className="divider divider-horizontal"></div>
      <div className="h-full p-2">
        <ControlPanel dfa={dfa} setActiveEdge={setActiveEdge} activeEdge={activeEdge} />
      </div>
    </div>
  );
};

export default DFA;

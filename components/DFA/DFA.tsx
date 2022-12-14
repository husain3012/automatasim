import React, { useEffect, useState } from "react";
import ControlPanel from "./ControlPanel";
import Canvas from "./Canvas";
import useDFA from "../../hooks/useDFA";

const DFA = () => {
  const dfa = useDFA();
  const [activeEdge, setActiveEdge] = useState(null);

  return (
    <div className="flex flex-col sm:flex-row  ">
      <div className="h-[30vh] sm:h-[90vh]   w-full sm:w-3/5  px-2">
        <Canvas dfa={dfa} activeEdge={activeEdge} />
      </div>
      <div className="divider sm:divider-horizontal"></div>
      <div className="mx-auto flex-col content-center sm:h-[90vh] m-2 p-2  sm:overflow-y-scroll scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-base-200  ">
        <ControlPanel dfa={dfa} setActiveEdge={setActiveEdge} activeEdge={activeEdge} />
      </div>
    </div>
  );
};

export default DFA;

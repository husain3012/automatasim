import React, { useEffect, useState } from "react";
import ControlPanel from "./ControlPanel";
import Canvas from "./Canvas";
import useDFA from "../../hooks/useDFA";
import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai";

const DFA = () => {
  const dfa = useDFA();
  const [activeEdge, setActiveEdge] = useState(null);
  const [panelCollapsed, setPanelCollapsed] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row  border-b-2 border-base-200 ">
      <div className="h-[30vh] sm:h-[90vh]   w-full  px-2">
        <Canvas dfa={dfa} activeEdge={activeEdge} />
      </div>
      <div className="divider sm:divider-horizontal"></div>
      <div className="mx-auto flex-col content-center sm:h-[90vh] m-2 p-2  sm:overflow-y-scroll scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-base-200  ">
        <div className="flex flex-row justify-between items-center my-2">
          {!panelCollapsed && <h1 className="text-2xl font-bold">DFA</h1>}
          <button
            className="btn btn-ghost"
            onClick={() => setPanelCollapsed(!panelCollapsed)}
          >
            {panelCollapsed ? (
              <AiFillLeftCircle className="w-6 h-6" />
            ) : (
              <AiFillRightCircle className="w-6 h-6" />
            )}
          </button>
        </div>

        {!panelCollapsed && (
          <ControlPanel
            dfa={dfa}
            setActiveEdge={setActiveEdge}
            activeEdge={activeEdge}
          />
        )}
      </div>
    </div>
  );
};

export default DFA;

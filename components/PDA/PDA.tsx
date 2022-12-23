import React, { useEffect, useState } from "react";
import ControlPanel from "./ControlPanel";
import Canvas from "./Canvas";
import usePDA, { INITIAL_STACK_SYMBOL } from "../../hooks/usePDA";
import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { getPostById } from "../../services/posts";
const PDA = () => {
  const pda = usePDA();
 
  const router = useRouter();

  useEffect(() => {
    const loadPda = async () => {
      const pdaString = localStorage.getItem("pda");
      const loadPda = router.query?.load;

      if (loadPda) {
        try {
          const example = await getPostById(loadPda as string);
          if (example) {
            pda.load(example.data);
            toast.success("PDA loaded!");
          } else {
            toast.error("No pda found!");
          }
        } catch (error) {
          console.log(error);
          toast.error("Unknown error!");
        }
      } else if (pdaString) {
        toast.success("PDA loaded from local storage!");
        pda.load(pdaString);
      }
    };
    loadPda();
  }, []);

  const [activeEdge, setActiveEdge] = useState(null);
  const [stackState, setStackState] = useState([INITIAL_STACK_SYMBOL])
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const [showLoadPdaModal, setShowLoadPdaModal] = useState({
    show: false,
    input: "",
  });

  const copyPdaHandler = async () => {
    const pdaString = pda.stringify();
    navigator.clipboard.writeText(pdaString);
    toast.success("PDA copied to clipboard!");
  };

  const savePdaHandler = async () => {
    const pdaString = pda.stringify();
    localStorage.setItem("pda", pdaString);
    toast.success("PDA saved to local storage!");
  };
  const loadPdaHandler = () => {
    try {
      pda.load(showLoadPdaModal.input);
      toast.success("PDA loaded!");
      setShowLoadPdaModal({
        show: false,
        input: "",
      });
    } catch (error) {
      console.log(error);
      toast.error("Invalid PDA!");
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row  border-b-2 border-base-200 ">
        <div className="h-[30vh] sm:h-[90vh]   w-full  px-2">
          <Canvas pda={pda} activeEdge={activeEdge} stackState={stackState} />
        </div>
        <div className="divider sm:divider-horizontal"></div>
        <div
          className={`mx-auto flex-col content-center sm:h-[90vh] m-2 p-2  sm:overflow-y-scroll scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-base-200  ${
            !panelCollapsed ? "min-w-[20vw]" : ""
          }`}
        >
          <div className="flex flex-row justify-between items-center my-2">
            <div className="flex flex-col gap-2 w-full justify-between items-center ">
              <div className="flex flex-row justify-between items-center  w-full">
                <button
                  className="btn btn-ghost hidden sm:block"
                  onClick={() => setPanelCollapsed(!panelCollapsed)}
                >
                  {panelCollapsed ? (
                    <AiFillLeftCircle className="w-6 h-6" />
                  ) : (
                    <AiFillRightCircle className="w-6 h-6" />
                  )}
                </button>
                {!panelCollapsed && (
                  <h1 className="text-2xl font-bold w-full text-center">PDA</h1>
                )}
              </div>
              {!panelCollapsed && (
                <div className="flex gap-2 mx-2">
                  <button
                    className="btn btn-outline btn-sm btn-primary"
                    onClick={savePdaHandler}
                  >
                    Save
                  </button>

                  <button
                    onClick={copyPdaHandler}
                    className="btn btn-outline btn-sm btn-success"
                  >
                    Copy
                  </button>
                  <button
                    className="btn btn-outline btn-sm btn-warning"
                    onClick={() => pda.reset()}
                  >
                    Reset
                  </button>

                  <button
                    onClick={() =>
                      setShowLoadPdaModal({
                        show: true,
                        input: "",
                      })
                    }
                    className="btn btn-outline btn-sm btn-ghost"
                  >
                    Load
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="divider"></div>

          {!panelCollapsed && (
            <ControlPanel
              pda={pda}
              setActiveEdge={setActiveEdge}
              activeEdge={activeEdge}
              setStackState={setStackState}
              stackState={stackState}
            />
          )}
        </div>
      </div>

      <div className={`modal ${showLoadPdaModal.show && "modal-open"}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            Enter PDA JSON to load it in the editor
          </h3>
          <div className="mockup-code my-2">
            <pre>
              <textarea
                onChange={(e) => {
                  setShowLoadPdaModal((prev) => {
                    return {
                      ...prev,
                      input: e.target.value,
                    };
                  });
                }}
                className="textarea "
                placeholder="{}"
                value={showLoadPdaModal.input}
              />
            </pre>
          </div>

          <div className="modal-action">
            <button
              onClick={loadPdaHandler}
              className="btn btn-active btn-primary"
            >
              Load
            </button>
            <button
              onClick={() => {
                setShowLoadPdaModal({
                  show: false,
                  input: "",
                });
              }}
              className="btn btn-active btn-ghost"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PDA;

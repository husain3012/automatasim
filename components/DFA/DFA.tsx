import React, { useEffect, useState } from "react";
import ControlPanel from "./ControlPanel";
import Canvas from "./Canvas";
import useDFA from "../../hooks/useDFA";
import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { getPostById } from "../../services/posts";
const DFA = () => {
  const dfa = useDFA();
  const router = useRouter();

  useEffect(() => {
    const loadDfa = async () => {
      const dfaString = localStorage.getItem("dfa");
      const loadDfa = router.query?.load;

      if (loadDfa) {
        try {
          const example = await getPostById(loadDfa as string);
          if (example) {
            dfa.load(example.data);
            toast.success("DFA loaded!");
          } else {
            toast.error("No dfa found!");
          }
        } catch (error) {
          console.log(error);
          toast.error("Unknown error!");
        }
      
      }
      else if (dfaString) {
        toast.success("DFA loaded from local storage!");
        dfa.load(dfaString);
      }
    };
    loadDfa();
  }, []);

  const [activeEdge, setActiveEdge] = useState(null);
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const [showLoadDfaModal, setShowLoadDfaModal] = useState({
    show: false,
    input: "",
  });

  const copyDfaHandler = async () => {
    const dfaString = dfa.stringify();
    navigator.clipboard.writeText(dfaString);
    toast.success("DFA copied to clipboard!");
  };

  const saveDfaHandler = async () => {
    const dfaString = dfa.stringify();
    localStorage.setItem("dfa", dfaString);
    toast.success("DFA saved to local storage!");
  };
  const loadDfaHandler = () => {
    try {
      dfa.load(showLoadDfaModal.input);
      toast.success("DFA loaded!");
      setShowLoadDfaModal({
        show: false,
        input: "",
      });
    } catch (error) {
      console.log(error);
      toast.error("Invalid DFA!");
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row  border-b-2 border-base-200 ">
        <div className="h-[30vh] sm:h-[90vh]   w-full  px-2">
          <Canvas dfa={dfa} activeEdge={activeEdge} />
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
                  className="btn btn-ghost"
                  onClick={() => setPanelCollapsed(!panelCollapsed)}
                >
                  {panelCollapsed ? (
                    <AiFillLeftCircle className="w-6 h-6" />
                  ) : (
                    <AiFillRightCircle className="w-6 h-6" />
                  )}
                </button>
                {!panelCollapsed && (
                  <h1 className="text-2xl font-bold w-full text-center">DFA</h1>
                )}
              </div>
              {!panelCollapsed && (
                <div className="flex gap-2 mx-2">
                  <button
                    className="btn btn-outline btn-sm btn-primary"
                    onClick={saveDfaHandler}
                  >
                    Save
                  </button>

                  <button
                    onClick={copyDfaHandler}
                    className="btn btn-outline btn-sm btn-success"
                  >
                    Copy
                  </button>
                  <button
                    className="btn btn-outline btn-sm btn-warning"
                    onClick={() => dfa.reset()}
                  >
                    Reset
                  </button>

                  <button
                    onClick={() =>
                      setShowLoadDfaModal({
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
              dfa={dfa}
              setActiveEdge={setActiveEdge}
              activeEdge={activeEdge}
            />
          )}
        </div>
      </div>

      <div className={`modal ${showLoadDfaModal.show && "modal-open"}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            Enter DFA JSON to load it in the editor
          </h3>
          <div className="mockup-code my-2">
            <pre>
              <textarea
                onChange={(e) => {
                  setShowLoadDfaModal((prev) => {
                    return {
                      ...prev,
                      input: e.target.value,
                    };
                  });
                }}
                className="textarea "
                placeholder="{}"
                value={showLoadDfaModal.input}
              />
            </pre>
          </div>

          <div className="modal-action">
            <button
              onClick={loadDfaHandler}
              className="btn btn-active btn-primary"
            >
              Load
            </button>
            <button
              onClick={() => {
                setShowLoadDfaModal({
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

export default DFA;

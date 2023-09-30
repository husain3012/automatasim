import React, { useEffect, useState } from "react";
import ControlPanel from "./ControlPanel";
import Canvas from "./Canvas";
import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { getPostById } from "../../services/posts";
import useTM, { BLANK_SYMBOL } from "../../hooks/useTM";
const TM  = () => {
  const tm = useTM();
 
  const router = useRouter();

  useEffect(() => {
    const loadTm = async () => {
      const tmString = localStorage.getItem("tm");
      const loadTm = router.query?.load;

      if (loadTm) {
        try {
          const example = await getPostById(loadTm as string);
          if (example) {
            tm.load(example.data);
            toast.success("TM loaded!");
          } else {
            toast.error("No TM found!");
          }
        } catch (error) {
          console.log(error);
          toast.error("Unknown error!");
        }
      } else if (tmString) {
        toast.success("TM loaded from local storage!");
        tm.load(tmString);
      }
    };
    loadTm();
  }, []);

  const [activeEdge, setActiveEdge] = useState(null);
  const [tapeState, setTapeState] = useState({pointer:0, tape:[BLANK_SYMBOL]})
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const [showLoadTmModal, setShowLoadTmModal] = useState({
    show: false,
    input: "",
  });

  const copyTmHandler = async () => {
    const tmString = tm.stringify();
    navigator.clipboard.writeText(tmString);
    toast.success("TM copied to clipboard!");
  };

  const saveTmHandler = async () => {
    const tmString = tm.stringify();
    localStorage.setItem("tm", tmString);
    toast.success("TM saved to local storage!");
  };
  const loadTmHandler = () => {
    try {
      tm.load(showLoadTmModal.input);
      toast.success("TM loaded!");
      setShowLoadTmModal({
        show: false,
        input: "",
      });
    } catch (error) {
      console.log(error);
      toast.error("Invalid TM!");
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row  border-b-2 border-base-200 ">
        <div className="h-[30vh] sm:h-[90vh]   w-full  px-2">
          <Canvas tm={tm} activeEdge={activeEdge} tapeState={tapeState} />
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
                  <h1 className="text-2xl font-bold w-full text-center">TM</h1>
                )}
              </div>
              {!panelCollapsed && (
                <div className="flex gap-2 mx-2">
                  <button
                    className="btn btn-outline btn-sm btn-primary"
                    onClick={saveTmHandler}
                  >
                    Save
                  </button>

                  <button
                    onClick={copyTmHandler}
                    className="btn btn-outline btn-sm btn-success"
                  >
                    Copy
                  </button>
                  <button
                    className="btn btn-outline btn-sm btn-warning"
                    onClick={() => tm.reset()}
                  >
                    Reset
                  </button>

                  <button
                    onClick={() =>
                      setShowLoadTmModal({
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
              tm={tm}
              setActiveEdge={setActiveEdge}
              activeEdge={activeEdge}
              setTapeState={setTapeState}
              tapeState={tapeState}
            />
          )}
        </div>
      </div>

      <div className={`modal ${showLoadTmModal.show && "modal-open"}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            Enter TM JSON to load it in the editor
          </h3>
          <div className="mockup-code my-2">
            <pre>
              <textarea
                onChange={(e) => {
                  setShowLoadTmModal((prev) => {
                    return {
                      ...prev,
                      input: e.target.value,
                    };
                  });
                }}
                className="textarea "
                placeholder="{}"
                value={showLoadTmModal.input}
              />
            </pre>
          </div>

          <div className="modal-action">
            <button
              onClick={loadTmHandler}
              className="btn btn-active btn-primary"
            >
              Load
            </button>
            <button
              onClick={() => {
                setShowLoadTmModal({
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

export default TM;

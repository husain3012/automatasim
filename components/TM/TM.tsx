import React, { useEffect, useState } from "react";
import ControlPanel from "./ControlPanel";
import Canvas from "./Canvas";
import useTuring from "../../hooks/useTuring";
import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { getPostById } from "../../services/posts";

import Tape from "./Tape";



const TM = () => {
  const TM = useTuring();
  const router = useRouter();

  useEffect(() => {
    const loadTM = async () => {
      const TMString = localStorage.getItem("TM");
      const loadTM = router.query?.load;

      if (loadTM) {
        try {
          const example = await getPostById(loadTM as string);
          if (example) {
            TM.load(example.data);
            toast.success("TM loaded!");
          } else {
            toast.error("No TM found!");
          }
        } catch (error) {
          console.log(error);
          toast.error("Unknown error!");
        }
      
      }
      else if (TMString) {
        toast.success("TM loaded from local storage!");
        TM.load(TMString);
      }
    };
    loadTM();
  }, []);

  const [activeEdge, setActiveEdge] = useState(null);
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const [showLoadTMModal, setShowLoadTMModal] = useState({
    show: false,
    input: "",
  });

  const copyTMHandler = async () => {
    const TMString = TM.stringify();
    navigator.clipboard.writeText(TMString);
    toast.success("TM copied to clipboard!");
  };

  const saveTMHandler = async () => {
    const TMString = TM.stringify();
    localStorage.setItem("TM", TMString);
    toast.success("TM saved to local storage!");
  };
  const loadTMHandler = () => {
    try {
      TM.load(showLoadTMModal.input);
      toast.success("TM loaded!");
      setShowLoadTMModal({
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

        <Canvas tm={TM} activeEdge={activeEdge} />
        <Tape tape={TM.TAPE} tapeHead={TM.tapeHead} />
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
                    onClick={saveTMHandler}
                  >
                    Save
                  </button>

                  <button
                    onClick={copyTMHandler}
                    className="btn btn-outline btn-sm btn-success"
                  >
                    Copy
                  </button>
                  <button
                    className="btn btn-outline btn-sm btn-warning"
                    onClick={() => TM.reset()}
                  >
                    Reset
                  </button>

                  <button
                    onClick={() =>
                      setShowLoadTMModal({
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

          {/* {!panelCollapsed && (
            <ControlPanel
              tm={TM}
              setActiveEdge={setActiveEdge}
              activeEdge={activeEdge}
            />
          )} */}
        </div>
      </div>

      <div className={`modal ${showLoadTMModal.show && "modal-open"}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            Enter TM JSON to load it in the editor
          </h3>
          <div className="mockup-code my-2">
            <pre>
              <textarea
                onChange={(e) => {
                  setShowLoadTMModal((prev) => {
                    return {
                      ...prev,
                      input: e.target.value,
                    };
                  });
                }}
                className="textarea "
                placeholder="{}"
                value={showLoadTMModal.input}
              />
            </pre>
          </div>

          <div className="modal-action">
            <button
              onClick={loadTMHandler}
              className="btn btn-active btn-primary"
            >
              Load
            </button>
            <button
              onClick={() => {
                setShowLoadTMModal({
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

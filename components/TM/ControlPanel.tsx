import React, { Dispatch, useState } from "react";
import { TMInterface } from "../../interfaces/tm-hook";
// import useSound from "use-sound";
// import bubble from "../../public/sounds/bubble.mp3";
// import droplet from "../../public/sounds/drop.mp3";
import { BLANK_SYMBOL } from "../../hooks/useTM";
import { timeStamp } from "console";
const ControlPanel = ({
  tm,
  setActiveEdge,
  activeEdge,
  setTapeState,
  tapeState,
}: {
  tm: TMInterface;
  setActiveEdge?: Dispatch<string>;
  activeEdge?: string;
  setTapeState?: Dispatch<{ pointer: number; tape: string[] }>;
  tapeState?: { pointer: number; tape: string[] };
}) => {
  const [input, setInput] = useState("");
  const [testResult, setTestResult] = useState(null);
  const [simSpeed, setSimSpeed] = useState(300);

  // const [addNewTransition, setAddNewTransition] = useState({
  //   source: "",
  //   target: "",
  //   input: "",
  // });
  const [newState, setNewState] = useState({
    name: "",
    isFinal: false,
    isInitial: false,
  });
  const [processingString, setProcessingString] = useState("");

  const addNewStateHandler = () => {
    const { name, isFinal, isInitial } = newState;
    tm.addState(name, isFinal, isInitial);
    setNewState({ name: "", isFinal: false, isInitial: false });
  };

  const testStringHandler = () => {
    const { accepted } = tm.test(input);
    setTestResult(accepted);
  };
  const deleteTransitionHandler = (from: string, on: string) => {
    tm.removeTransition(from, on);
  };

  const simulateGraphically = async () => {
    setTapeState({ pointer: 0, tape: [BLANK_SYMBOL] });
    const { accepted, path, tape } = tm.test(input);
    let i = 0;
    for (const edge of path) {
      setActiveEdge(edge);
      i++;
      setTapeState(tape[i]);
    

      setProcessingString(input.slice(0, i));

      await new Promise((resolve) => setTimeout(resolve, simSpeed));
    }
    if (accepted) {
      setTestResult(true);
    } else {
      setTestResult(false);
    }
    setActiveEdge(null);
   
  };

  const transitionTable = tm.print();

  return (
    <div className="">
      <React.Fragment>
        <div className=" flex flex-col">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="State"
              className="input input-bordered w-20 input-accent"
              value={newState.name}
              onChange={(e) =>
                setNewState((prev) => ({ ...prev, name: e.target.value }))
              }
              autoComplete='off'
            />{" "}
            <button
              onClick={addNewStateHandler}
              className="btn btn-success"
              disabled={newState.name.length === 0}
            >
              Add New State
            </button>
          </div>
          <div className="flex flex-row gap-2">
            <label className="label cursor-pointer">
              <span className="label-text mr-2">Initial</span>
              <input
                type="checkbox"
                checked={newState.isInitial}
                disabled={tm.initialState !== null}
                className="checkbox checkbox-primary checkbox-xs"
                onChange={(e) =>
                  setNewState((prev) => ({
                    ...prev,
                    isInitial: e.target.checked,
                  }))
                }
              />
            </label>
            <label className="label cursor-pointer">
              <span className="label-text mr-2">Final</span>
              <input
                type="checkbox"
                checked={newState.isFinal}
                className="checkbox checkbox-primary checkbox-xs"
                onChange={(e) =>
                  setNewState((prev) => ({
                    ...prev,
                    isFinal: e.target.checked,
                  }))
                }
              />
            </label>
          </div>
        </div>
      </React.Fragment>
      <div className="divider"></div>

      {tm.states.length > 0 && (
        <React.Fragment>
          <div className="flex gap-1">
            <input
              value={input}
              onChange={(e) => {
                if (testResult) setTestResult(null);
                if (activeEdge) setActiveEdge(null);
                setInput(e.target.value);
              }}
              type="text"
              placeholder="Input test string"
              className="input input-bordered input-success  w-1/2"
            />
            <button
              onClick={testStringHandler}
              className={`btn ml-auto   ${
                testResult === true
                  ? "btn-success"
                  : testResult === false
                  ? "btn-error"
                  : "btn-primary"
              } min-w-[8em]`}
              disabled={
                tm.initialState === null ||
                tm.finalStates.length === 0 ||
                !!activeEdge
              }
            >
              {testResult === null && "Test"}
              {testResult === true && "Accepted"}
              {testResult === false && "Rejected"}
            </button>

            <button
              onClick={() => {
                setInput("");
                setTestResult(null);
                setActiveEdge(null);
                setProcessingString("");
                setTapeState({pointer:0, tape:[BLANK_SYMBOL]})
              }}
              className="btn btn-secondary"
            >
              Reset
            </button>
          </div>

          <div className="flex-col my-2">
            <div className="badge badge-sm">Sim Speed: {simSpeed} ms</div>
            <input
              type="range"
              min="0"
              max="3000"
              value={simSpeed}
              onChange={(e) => setSimSpeed(parseInt(e.target.value))}
              className="range range-xs"
            />
            <button
              disabled={
                tm.initialState === null ||
                tm.finalStates.length === 0 ||
                !!activeEdge
              }
              onClick={() => {
                simulateGraphically();
              }}
              className="btn  w-full"
            >
              Sim
            </button>

            {processingString.length > 0 && (
              <div className="mockup-code my-2 max-w-md scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-base-200">
                <pre data-prefix="$">
                  <code>{processingString}</code>
                </pre>
                {testResult != null &&
                  !activeEdge &&
                  (testResult === false ? (
                    <pre
                      data-prefix="$"
                      className="bg-warning text-warning-content"
                    >
                      <code>
                        {processingString.length === input.length
                          ? "Not terminating on accepting state."
                          : "Invalid input."}
                      </code>
                    </pre>
                  ) : (
                    <pre data-prefix="$" className="text-success">
                      <code>Accepted🎉!</code>
                    </pre>
                  ))}
              </div>
            )}
          </div>
        </React.Fragment>
      )}

      <div className="divider"></div>

      <React.Fragment>
        <div className="max-w-sm md:max-w-md overflow-x-auto scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-base-200">
          <h3 className="text-lg font-bold">Transitions</h3>
          <table className="table ">
            <thead>
              <tr>
                <th>From</th>
                <th>Input</th>
                <th>To</th>
                <th>Write</th>
                <th>Move</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {transitionTable.map((row, index) => {
                return (
                  <tr key={index}>
                    {/* from */}
                    <td key={index} className="text-center">
                      <span
                        className={`rounded-full border-2 p-2 ${
                          tm.finalStates.includes(row[0])
                            ? "border-green-400"
                            : "border-transparent"
                        } ${
                          tm.initialState === row[0]
                            ? "font-bold text-pink-500"
                            : ""
                        }`}
                      >
                        {row[0]}
                      </span>
                    </td>
                    {/* input */}
                    <td key={index} className="text-center">
                      <span className={` `}>{row[1]}</span>
                    </td>
                    {/* Next state */}
                    <td key={index} className="text-center">
                      <span className={` `}>{row[2]}</span>
                    </td>
                    {/* Write */}
                    <td key={index} className="text-center">
                      <span className={` `}>{row[3]}</span>
                    </td>
                    {/* Tape head move */}
                    <td key={index} className="text-center">
                      <span className={` `}>{row[4] ? row[4] : "ε"}</span>
                    </td>
                    {/* ============ */}
                    <td>
                      <button
                        onClick={() => deleteTransitionHandler(row[0], row[1])}
                        className="btn btn-error btn-sm text-base-300"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </React.Fragment>
    </div>
  );
};

export default ControlPanel;

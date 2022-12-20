import React, { Dispatch, useState } from "react";
import { DFAInterface } from "../../interfaces/dfa-hook";
const ControlPanel = ({
  dfa,
  setActiveEdge,
  activeEdge,
}: {
  dfa: DFAInterface;
  setActiveEdge?: Dispatch<string>;
  activeEdge?: string;
}) => {
  const [input, setInput] = useState("");
  const [testResult, setTestResult] = useState(null);
  const [simSpeed, setSimSpeed] = useState(300);
  const [maxItr, setMaxItr] = useState(1000);

  const [exampleInputs, setExampleInputs] = useState({
    data: [],
    found: false,
    visible: false,
    loading: false,
  });
  const [addNewTransition, setAddNewTransition] = useState({
    source: "",
    target: "",
    input: "",
  });
  const [newState, setNewState] = useState({
    name: "",
    isFinal: false,
    isInitial: false,
  });
  const [processingString, setProcessingString] = useState("");

  const addStateSourceHandler = (e) => {
    setAddNewTransition((prev) => ({ ...prev, source: e.target.value }));
  };
  const addStateTargetHandler = (e) => {
    setAddNewTransition((prev) => ({ ...prev, target: e.target.value }));
  };
  const addStateInputHandler = (e) => {
    if (e.target.value.length > 1) return;
    setAddNewTransition((prev) => ({ ...prev, input: e.target.value }));
  };
  const addTransitionHandler = () => {
    const { source, target, input } = addNewTransition;

    dfa.addTransition(source, target, input);
    setAddNewTransition((prev) => ({ ...prev, input: "" }));
  };

  const addNewStateHandler = () => {
    const { name, isFinal, isInitial } = newState;
    dfa.addState(name, isFinal, isInitial);
    setNewState({ name: "", isFinal: false, isInitial: false });
  };

  const testStringHandler = () => {
    const { accepted } = dfa.test(input);
    setTestResult(accepted);
  };
  const deleteStateHandler = (state: string) => {
    dfa.removeState(state);
  };

  const simulateGraphically = async () => {
    const { accepted, path } = dfa.test(input);
    let i = 0;
    for (const edge of path) {
      setActiveEdge(edge);
      i++;
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

  const transitionTable = dfa.print();

  return (
    <div className="">
      {dfa.states.length > 0 && (
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
                dfa.initialState === null ||
                dfa.finalStates.length === 0 ||
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
                dfa.initialState === null ||
                dfa.finalStates.length === 0 ||
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

            {dfa.states.length > 0 && (
              <React.Fragment>
                <div
                  className={`badge badge-sm   ${
                    maxItr > 20000 && "badge-error"
                  } `}
                >
                  Max Iterations: {maxItr} {maxItr > 20000}
                </div>

                <input
                  type="range"
                  min="1000"
                  max="100000"
                  value={maxItr}
                  onChange={(e) => setMaxItr(parseInt(e.target.value))}
                  className="range range-xs"
                />
                <button
                  disabled={
                    dfa.initialState === null || dfa.finalStates.length === 0
                  }
                  onClick={async () => {
                    setExampleInputs((prev) => ({ ...prev, loading: true }));
                    const strings = await dfa.generateValidStrings(
                      100000,
                      maxItr
                    );
                    setExampleInputs(() => ({
                      data: strings,
                      found: strings.length > 0,
                      visible: true,
                      loading: false,
                    }));
                  }}
                  className={`btn  w-full ${
                    exampleInputs.loading && "loading"
                  } `}
                >
                  Try finding valid strings &nbsp;
                  {maxItr > 20000 && "(Page may freeze)"}
                </button>
              </React.Fragment>
            )}
            {exampleInputs.visible && (
              <div className="max-h-[200px]  my-2 overflow-y-auto overflow-x-auto max-w-md scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-base-200">
                <div className="mockup-code  scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-base-200 ">
                  {}
                  {!exampleInputs.found && (
                    <pre
                      data-prefix="$"
                      className="bg-error text-error-content"
                    >
                      <code>Could not find anything 😓</code>
                    </pre>
                  )}
                  {exampleInputs.found && (
                    <React.Fragment>
                      <pre data-prefix="$" className="text-success">
                        <code>Valid Strings...</code>
                      </pre>
                      {exampleInputs.data.map((str) => (
                        <pre key={str} data-prefix="$">
                          <code>{str}</code>
                        </pre>
                      ))}
                    </React.Fragment>
                  )}
                </div>
              </div>
            )}
          </div>
        </React.Fragment>
      )}

      <div className="divider"></div>

      <React.Fragment>
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
                  disabled={dfa.initialState !== null}
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
          <div className="divider"></div>

          {dfa.states.length > 0 && (
            <React.Fragment>
              <table className="table w-full mb-2">
                <thead>
                  <tr>
                    <th>
                      <select
                        value={addNewTransition.source}
                        onChange={addStateSourceHandler}
                        className="select select-sm"
                        defaultValue={""}
                      >
                        <option disabled value={""}>
                          Source
                        </option>
                        {dfa.states.map((state, index) => {
                          return <option key={index}>{state}</option>;
                        })}
                      </select>
                    </th>
                    <th>
                      <input
                        type="text"
                        placeholder="Input"
                        className="input input-sm w-28"
                        value={addNewTransition.input}
                        onChange={addStateInputHandler}
                      />
                    </th>
                    <th>
                      <select
                        value={addNewTransition.target}
                        onChange={addStateTargetHandler}
                        className="select select-sm"
                        defaultValue={""}
                      >
                        <option disabled value={""}>
                          Target
                        </option>
                        {dfa.states.map((state, index) => {
                          return <option key={index}>{state}</option>;
                        })}
                      </select>
                    </th>
                  </tr>
                </thead>
              </table>
              <button
                disabled={
                  addNewTransition.source === "" ||
                  addNewTransition.target === "" ||
                  addNewTransition.input === ""
                }
                onClick={addTransitionHandler}
                className="btn  w-full"
              >
                Add Transition
              </button>
            </React.Fragment>
          )}
        </React.Fragment>
        <div className="divider"></div>

        <div className="max-w-md overflow-x-auto scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-base-200">
          {dfa.states.length > 0 && (
            <table className="table ">
              <thead>
                <tr>
                  <th>States</th>
                  {transitionTable[0].slice(1).map((item, index) => {
                    return (
                      <th key={index} className={"text-center"}>
                        {item}
                      </th>
                    );
                  })}
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {transitionTable.slice(1).map((row, index) => {
                  return (
                    <tr key={index}>
                      {row.map((item, index) => {
                        return (
                          <td key={index} className="text-center">
                            <span
                              className={`rounded-full border-2 p-2 ${
                                dfa.finalStates.includes(item) && index === 0
                                  ? "border-green-400"
                                  : "border-transparent"
                              } ${
                                dfa.initialState === item && index == 0
                                  ? "font-bold text-pink-500"
                                  : ""
                              }`}
                            >
                              {item}
                            </span>
                          </td>
                        );
                      })}
                      <td>
                        <button
                          onClick={() => deleteStateHandler(row[0])}
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
          )}
        </div>
      </React.Fragment>
    </div>
  );
};

export default ControlPanel;

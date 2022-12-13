import React, { useEffect, useState } from "react";
import useDFA from "../../hooks/useDFA";
import { DFAInterface } from "../../interfaces";
const ControlPanel = ({ dfa }: { dfa: DFAInterface }) => {
  const [input, setInput] = useState("");
  const [testResult, setTestResult] = useState(null);
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

  const transitionTable = dfa.print();

  return (
    <div>
      <div className="flex gap-1  ">
        <input
          value={input}
          onChange={(e) => {
            setTestResult(null);
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
          >
            {testResult === null && "Test"}
            {testResult === true && "Accepted"}
            {testResult === false && "Rejected"}
          </button>

          <button
            onClick={() => {
              setInput("");
              setTestResult(null);
            }}
            className="btn btn-secondary"
          >
            Reset
          </button>
      </div>
      <div className="divider"></div>
      <div>
        <div className="flex-col mb-4">
          <div className="flex justify-between mt-2">
            <div className="flex flex-col">
              <input
                type="text"
                placeholder="State"
                className="input input-bordered input-accent"
                value={newState.name}
                onChange={(e) =>
                  setNewState((prev) => ({ ...prev, name: e.target.value }))
                }
              />{" "}
              <div className="flex flex-row justify-evenly">
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

            <button
              onClick={addNewStateHandler}
              className="btn btn-success"
              disabled={newState.name.length === 0}
            >
              Add New State
            </button>
          </div>
          <div className="divider"></div>
          <table className="table w-full mb-2">
            <thead>
              <tr>
                <th>
                  <select
                    value={addNewTransition.source}
                    onChange={addStateSourceHandler}
                    className="select select-sm"
                  >
                    <option disabled selected value={""}>
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
                  >
                    <option disabled selected value={""}>
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
        </div>
        <div className="divider"></div>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>States</th>
                {transitionTable[0].slice(1).map((item, index) => {
                  return (
                    <th key={index} className={`text-center`}>
                      {item}
                    </th>
                  );
                })}
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
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;

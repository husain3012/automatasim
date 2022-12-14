import { useState } from "react";
import { DFAInterface } from "../interfaces/dfa-hook";

const initialState: {
  states: string[];
  initialState: string | null;
  finalStates: string[];
  inputSymbols: Set<string>;
  transitions: Record<string, Record<string, string>>;
} = {
  states: [],
  initialState: null,
  finalStates: [],
  inputSymbols: new Set(),
  transitions: {},
};

const useDFA = (): DFAInterface => {
  const [dfa, setDfa] = useState(initialState);


  const updateSetOfInputSymbols = () => {
    dfa.inputSymbols.clear();
    for (const from in dfa.transitions) {
      for (const input in dfa.transitions[from]) {
        dfa.inputSymbols.add(input);
      }
    }
  };

  const addState = (state: string, isFinal = false, isInitial = false) => {
    // if state already exists, do not add it
    if (dfa.states.includes(state)) {
      return;
    }
    const current_state = { ...dfa };
    current_state.states.push(state);
    // if no initial state is set, set this state as initial
    if (isInitial && !dfa.initialState) {
      current_state.initialState = state;
      setDfa((prev) => ({
        ...prev,
        initialState: state,
      }));
    }
    // if isFinal is true, add this state to final states
    if (isFinal) {
      current_state.finalStates.push(state);
      setDfa((prev) => ({
        ...prev,
        finalStates: [...prev.finalStates, state],
      }));
    }
    // add empty transition object for this state
    current_state.transitions[state] = {};

    setDfa(current_state);
  };
  const addTransition = (from: string, to: string, input: string) => {
    if (input.length !== 1) {
      new Error("Invalid input");
      return;
    }
    // if from or to state does not exist, do not add transition
    if (!dfa.states.includes(from)) {
      new Error(`State "${from}" does not exit.`);
      return;
    }
    if (!dfa.states.includes(to)) {
      new Error(`State "${to}" does not exit.`);
      return;
    }
    // if transition already exists, do not add it
    if (dfa.transitions[from][input] == to) {
      console.log("Transition already present.");
      return;
    }
    dfa.transitions[from][input] = to;
    dfa.inputSymbols.add(input);

    setDfa((prev) => ({
      ...prev,
      transitions: {
        ...prev.transitions,
        [from]: {
          ...prev.transitions[from],
          [input]: to,
        },
      },
    }));
  };

  const removeState = (state: string) => {
    // if state does not exist, do not remove it
    if (!dfa.states.includes(state)) {
      console.log("State does not exist.");
      return;
    }

    const currentState = { ...dfa };

    // remove state from states

    currentState.states = currentState.states.filter((s) => s !== state);
    // remove state from final states
    currentState.finalStates = currentState.finalStates.filter(
      (s) => s !== state
    );
    if (currentState.initialState == state) {
      currentState.initialState = null;
    }

    // remove state from transitions
    delete currentState.transitions[state];
    // remove transitions to state
    for (const from in currentState.transitions) {
      for (const input in currentState.transitions[from]) {
        if (currentState.transitions[from][input] == state) {
          delete currentState.transitions[from][input];
        }
      }
    }
    setDfa(currentState);
    updateSetOfInputSymbols();
  };
  const removeTransition = (from: string, to: string, input: string) => {
    // if from state does not exist, do not remove transition
    if (!dfa.states.includes(from)) {
      return;
    }
    // if transition does not exist, do not remove it
    if (!dfa.transitions[from][input]) {
      return;
    }
    if (dfa.transitions[from][input] != to) {
      return;
    }
    delete dfa.transitions[from][input];
    // update set of input symbols:
    updateSetOfInputSymbols();
  };

  const test = (
    input: string
  ): {
    accepted: boolean;
    path: string[];
  } => {
    const path = [];
    let current_state = dfa.initialState;
    let i = 0;

    for (; i < input.length; i++) {
      const ch = input[i];
      if (!dfa.transitions[current_state][ch]) {
        return {
          accepted: false,
          path,
        };
      }
      const nextState = dfa.transitions[current_state][ch];
      path.push(current_state + "@" + ch + ">" + nextState);
      current_state = nextState;
    }
    if (dfa.finalStates.includes(current_state)) {
      return {
        accepted: true,
        path,
      };
    }
    return {
      accepted: false,
      path,
    };
  };
  const print = (): Array<[]> => {
    const transitionTable = [];
    transitionTable.push(["States/Inputs", ...Array.from(dfa.inputSymbols)]);
    for (const key in dfa.transitions) {
      let stateTransition = [];
      stateTransition = [key];
      for (let i = 1; i < transitionTable[0].length; i++) {
        stateTransition.push(
          dfa.transitions[key][transitionTable[0][i]] || "-"
        );
      }
      transitionTable.push(stateTransition);
    }
    return transitionTable;
  };

  const generateValidStrings = async (
    length: number,
    maxItr: 1000
  ): Promise<string[]> => {
    const validStrings = new Set<string>();
    const currentString = "";
    const current_state = dfa.initialState;
    length = Math.min(length, 1000);

    const queue = [];
    queue.push({ state: current_state, string: currentString });

    return await new Promise((resolve) => {
      let iterations = 0;
      while (queue.length > 0) {
        iterations++;
        if (iterations > maxItr) {
          break;
        }
        const { state, string } = queue.shift();

        if (dfa.finalStates.includes(state)) {
          validStrings.add(string);
        }
        if (validStrings.size === length) {
          break;
        }

        for (const input of Array.from(dfa.inputSymbols)) {
          if (dfa.transitions[state][input]) {
            queue.push({
              state: dfa.transitions[state][input],
              string: string + input,
            });
          }
        }
      }
      resolve(Array.from(validStrings));
    });
  };

  const stringify = () => {
    const dfa_copy = {
      states: dfa.states,
      initialState: dfa.initialState,
      finalStates: dfa.finalStates,
      inputSymbols: Array.from(dfa.inputSymbols),
      transitions: dfa.transitions,
    };

    return JSON.stringify(dfa_copy);
  };
  const load = (dfaString: string) => {
    const dfa_copy = JSON.parse(dfaString);
    dfa_copy.inputSymbols = new Set(dfa_copy.inputSymbols);
    setDfa(dfa_copy);
  };
  const reset = () => {
    setDfa({
      states: [],
      inputSymbols: new Set(),
      transitions: {},
      initialState: null,
      finalStates: [],
    });
  };

  return {
    ...dfa,
    addState,
    addTransition,
    removeState,
    removeTransition,
    test,
    print,
    generateValidStrings,
    stringify,
    load,
    reset,
  };
};
export default useDFA;

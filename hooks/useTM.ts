import { useState } from "react";
import { TMInterface } from "../interfaces/tm-hook";
import toast from "react-hot-toast";

export const BLANK_SYMBOL = "#";

export const HALTING_LIMIT = 100000


const initialState: {
  states: string[];
  initialState: string | null;
  finalStates: string[];
  inputSymbols: Set<string>;
  transitions: Record<
    string, // state
    Record<
      string, //input
      {
        next: string;
        write: string;
        move: "L" | "R";
      }
    >
  >;
} = {
  states: [],
  initialState: null,
  finalStates: [],
  inputSymbols: new Set(),
  transitions: {},
};

// δ( q0, a, Z ) = { ( q0, AZ ) }
// δ( q0, a, A) = { ( q0, AA ) }
// δ( q0, b, A) = { ( q1, ∈) }
// δ( q1, b, A) = { ( q1, ∈) }
// δ( q1, ∈, Z) = { ( q1, ∈) }

const useTM = (): TMInterface => {
  const [tm, setTM] = useState(initialState);

  const updateSetOfInputSymbols = () => {
    const updated_input_symbols = new Set<string>();
    for (const state in tm.transitions) {


      for (const input in tm.transitions[state]) {
        updated_input_symbols.add(input)
        updated_input_symbols.add(tm.transitions[state][input].write)
      }
    }
    setTM((prev) => ({
      ...prev,
      inputSymbols: new Set(Array.from(updated_input_symbols)),

    }));
  };

  const addState: TMInterface['addState'] = (state, isFinal, isInitial) => {
    // if state already exists, do not add it
    if (tm.states.includes(state)) {
      return;
    }
    const current_state = { ...tm };
    current_state.states.push(state);
    // if no initial state is set, set this state as initial
    if (isInitial && !tm.initialState) {
      current_state.initialState = state;
      setTM((prev) => ({
        ...prev,
        initialState: state,
      }));
    }
    // if isFinal is true, add this state to final states
    if (isFinal) {
      current_state.finalStates.push(state);
      setTM((prev) => ({
        ...prev,
        finalStates: [...prev.finalStates, state],
      }));
    }
    // add empty transition object for this state
    current_state.transitions[state] = {};

    setTM(current_state);
  };

  const addTransition: TMInterface['addTransition'] = (
    from, to, input, write, move


  ) => {
    if (input.length !== 1) {
      new Error("Invalid input");
      return;
    }
    if (write === "") write = BLANK_SYMBOL;


    const newTM = { ...tm };
    if (!newTM.transitions[from]) {
      newTM.transitions[from] = {};
    }

    newTM.transitions[from][input] = {
      move, next: to, write
    };



    newTM.inputSymbols = new Set([
      ...Array.from(newTM.inputSymbols),
      input,
    ]);

    setTM(newTM);
  };

  const removeState = (state: string) => {
    // if state does not exist, do not remove it
    if (!tm.states.includes(state)) {
      console.log("State does not exist.");
      return;
    }

    const currentState = { ...tm };

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
    // for (const from in currentState.transitions) {
    //   for (const input in currentState.transitions[from]) {
    //     if (currentState.transitions[from][input] == state) {
    //       delete currentState.transitions[from][input];
    //     }
    //   }
    // }
    setTM(currentState);
    updateSetOfInputSymbols();
  };

  const removeTransition: TMInterface['removeTransition'] = (
    from, input
  ) => {
    const tm_copy = { ...tm };
    try {

      delete tm_copy.transitions[from][input];
      setTM(tm_copy);
      updateSetOfInputSymbols();

    } catch (error) {
      console.log(error);
      console.log("Transition does not exist");
    }
  };

  const test: TMInterface['test'] = (
    input
  ) => {
    let pointer = 0;
    const path = [];

    const tapeHistory = [{ pointer: pointer, tape: Array.from(input) }];

    let current_state = tm.initialState;

    let iterations = 0;


    while (!tm.finalStates.includes(current_state)) {
      iterations++;
      if (iterations > HALTING_LIMIT) {
        toast.error('Halting Limit reached')
        break;
      };
      const currentTape = [...tapeHistory[tapeHistory.length - 1].tape]
      const char = currentTape[pointer];

      const inputMatch = tm.transitions[current_state][char];

      if (!inputMatch)
        return {
          accepted: false,
          path,
          tape: tapeHistory,
        };
      currentTape[pointer] = inputMatch.write;

      if (inputMatch.move == "L" && pointer > 0) {
        pointer--;
      } else {
        pointer++;
      }
      if (pointer >= currentTape.length) {
        currentTape.push(BLANK_SYMBOL)
      }



      path.push(current_state + ">" + inputMatch.next);
      tapeHistory.push({ pointer, tape: currentTape })


      current_state = inputMatch.next
    }


    if (

      tm.finalStates.includes(current_state)
    )
      return {
        accepted: true,
        path,
        tape: tapeHistory,
      };



    return {
      accepted: false,
      path,
      tape: tapeHistory,
    };
  };
  const print = (): Array<[]> => {
    const transitionsArray = [];
    for (const state in tm.transitions) {
      for (const input in tm.transitions[state]) {
        const { move, next, write } = tm.transitions[state][input];
        transitionsArray.push([state, input, next, write, move]);
      }
    }

    return transitionsArray;
  };

  //   const generateValidStrings = async (
  //     length: number,
  //     maxItr: 1000
  //   ): Promise<string[]> => {
  //     const validStrings = new Set<string>();
  //     const currentString = "";
  //     const current_state = tm.initialState;
  //     length = Math.min(length, 1000);

  //     const queue = [];
  //     queue.push({ state: current_state, string: currentString });

  //     return await new Promise((resolve) => {
  //       let iterations = 0;
  //       while (queue.length > 0) {
  //         iterations++;
  //         if (iterations > maxItr) {
  //           break;
  //         }
  //         const { state, string } = queue.shift();

  //         if (tm.finalStates.includes(state)) {
  //           validStrings.add(string);
  //         }
  //         if (validStrings.size === length) {
  //           break;
  //         }

  //         for (const input of Array.from(tm.inputSymbols)) {
  //           if (tm.transitions[state][input]) {
  //             queue.push({
  //               state: tm.transitions[state][input],
  //               string: string + input,
  //             });
  //           }
  //         }
  //       }
  //       resolve(Array.from(validStrings));
  //     });
  //   };

  const stringify = () => {
    const tm_copy = {
      ...tm,
      inputSymbols: Array.from(tm.inputSymbols),

    };

    return JSON.stringify(tm_copy);
  };

  const load = (tmString: string) => {
    const tm_copy = JSON.parse(tmString);
    tm_copy.inputSymbols = new Set(tm_copy.inputSymbols);

    setTM(tm_copy);
  };
  const reset = () => {
    setTM({
      states: [],
      finalStates: [],
      initialState: null,
      inputSymbols: new Set<string>(),
      transitions: {},
    });
  };

  return {
    ...tm,
    addState,
    addTransition,
    removeState,
    removeTransition,
    test,
    print,
    // generateValidStrings,
    stringify,
    load,
    reset,
  };
};
export default useTM;

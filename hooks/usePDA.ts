import { useEffect, useState } from "react";
import { PDAInterface } from "../interfaces/pda-hook";

export const INITIAL_STACK_SYMBOL = "#";

const initialState: {
  states: string[];
  initialState: string | null;
  stackSymbols: Set<string>;
  finalStates: string[];
  inputSymbols: Set<string>;
  // stack: string[];
  transitions: Record<
    string,
    Record<
      string,
      Record<
        string,
        {
          next: string;
          stack: string | null;
        }
      >
    >
  >;
} = {
  states: [],
  initialState: null,
  finalStates: [],
  inputSymbols: new Set(),
  stackSymbols: new Set(INITIAL_STACK_SYMBOL),
  transitions: {},
  // stack: [INITIAL_STACK_SYMBOL],
};

const transition = {
  q0: {
    a: {
      Z: {
        next: "q0",
        stack: "z",
      },
      a: {
        next: "q0",
        stack: "fafdsfdsfg",
      },
    },
    b: {},
  },
};

// δ( q0, a, Z ) = { ( q0, AZ ) }
// δ( q0, a, A) = { ( q0, AA ) }
// δ( q0, b, A) = { ( q1, ∈) }
// δ( q1, b, A) = { ( q1, ∈) }
// δ( q1, ∈, Z) = { ( q1, ∈) }

const usePDA = (): PDAInterface => {
  const [pda, setPda] = useState(initialState);

  const updateSetOfInputSymbols = () => {
    const updated_input_symbols = new Set<string>();
    const updated_stack_symbols = new Set<string>();
    for (const state in pda.transitions) {
      for (const input in pda.transitions[state]) {
        for (const topOfStack in pda.transitions[state][input]) {
          const { stack } = pda.transitions[state][input][topOfStack];
          updated_input_symbols.add(input);
          stack.split("").forEach((s) => updated_stack_symbols.add(s));
        }
      }
    }
    setPda((prev) => ({
      ...prev,
      inputSymbols: new Set(Array.from(updated_input_symbols)),
      stackSymbols: new Set(Array.from(updated_stack_symbols)),
    }));
  };

  const addState = (state: string, isFinal = false, isInitial = false) => {
    // if state already exists, do not add it
    if (pda.states.includes(state)) {
      return;
    }
    const current_state = { ...pda };
    current_state.states.push(state);
    // if no initial state is set, set this state as initial
    if (isInitial && !pda.initialState) {
      current_state.initialState = state;
      setPda((prev) => ({
        ...prev,
        initialState: state,
      }));
    }
    // if isFinal is true, add this state to final states
    if (isFinal) {
      current_state.finalStates.push(state);
      setPda((prev) => ({
        ...prev,
        finalStates: [...prev.finalStates, state],
      }));
    }
    // add empty transition object for this state
    current_state.transitions[state] = {};

    setPda(current_state);
  };

  const addTransition = (
    from: string,
    to: string,
    input: string,
    topOfStack: string,
    stackOperation: string
  ) => {
    if (input.length !== 1) {
      new Error("Invalid input");
      return;
    }
    if (topOfStack === "") topOfStack = INITIAL_STACK_SYMBOL;
    if (stackOperation === "") stackOperation = null;

    const updatedPda = { ...pda };
    if (!updatedPda.transitions[from]) {
      updatedPda.transitions[from] = {};
    }
    if (!updatedPda.transitions[from][input]) {
      updatedPda.transitions[from][input] = {};
    }
    if (!updatedPda.transitions[from][input][topOfStack]) {
      updatedPda.transitions[from][input][topOfStack] = {
        next: null,
        stack: null,
      };
    }
    updatedPda.transitions[from][input][topOfStack].next = to;
    updatedPda.transitions[from][input][topOfStack].stack =
      stackOperation?.length > 0 ? stackOperation : null;

    updatedPda.inputSymbols = new Set([
      ...Array.from(updatedPda.inputSymbols),
      input,
    ]);
    updatedPda.stackSymbols = new Set([
      ...Array.from(updatedPda.stackSymbols),
      topOfStack,
      ...(stackOperation?.split("") || []),
    ]);
    setPda(updatedPda);
  };

  const removeState = (state: string) => {
    // if state does not exist, do not remove it
    if (!pda.states.includes(state)) {
      console.log("State does not exist.");
      return;
    }

    const currentState = { ...pda };

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
    setPda(currentState);
    updateSetOfInputSymbols();
  };
  const removeTransition = (
    from: string,
    on: string,
    when: string,
    to: string,
    then: string
  ) => {
    const pda_copy = { ...pda };
    try {
      const transitionReference = pda_copy.transitions[from][on][when];
      if (
        transitionReference &&
        transitionReference.next === to &&
        transitionReference.stack === then
      ) {
        delete pda_copy.transitions[from][on][when];
        setPda(pda_copy);
        updateSetOfInputSymbols();
      }
    } catch (error) {
      console.log(error);
      console.log("Transition does not exist");
    }
  };

  const test = (
    input: string
  ): {
    accepted: boolean;
    path: string[];
    stackStates: string[][];
  } => {
    const path = [];

    const stackStates = [[INITIAL_STACK_SYMBOL]];
    let current_state = pda.initialState;
    let current_stack = [INITIAL_STACK_SYMBOL];
    let i = 0;
    for (; i < input.length; i++) {
      const char = input[i];
      const inputMatch = pda.transitions[current_state][char];
      if (!inputMatch)
        return {
          accepted: false,
          path,
          stackStates,
        };
      const stackTop = current_stack[current_stack.length - 1];
      current_stack = current_stack.filter(
        (_, i) => i < current_stack.length - 1
      );
      const stackTopMatch = inputMatch[stackTop];
      if (!stackTopMatch)
        return {
          accepted: false,
          path,
          stackStates,
        };

      const stackOperation = stackTopMatch.stack;

      if (stackOperation && stackOperation !== "") {
        stackOperation
          .split("")
          .reverse()
          .forEach((char) => {
            current_stack = [...current_stack, char];
          });
      }

      path.push(current_state + ">" + stackTopMatch.next);
      //  something seriously wrong going on over here!
      const copyStack = [...current_stack]; // idk why it's not working when directly pushing "current_stack"
      // console.log("current_stack", copyStack);
      stackStates.push(copyStack);
      // ---------------------------------------------

      current_state = stackTopMatch.next;
    }

    if (
      current_stack.pop() === INITIAL_STACK_SYMBOL &&
      pda.finalStates.includes(current_state)
    )
      return {
        accepted: true,
        path,
        stackStates,
      };

    // if ()
    //   return {
    //     accepted: true,
    //     path,
    //     stackStates,
    //   };

    return {
      accepted: false,
      path,
      stackStates,
    };
  };
  const print = (): Array<[]> => {
    const transitionsArray = [];
    for (const state in pda.transitions) {
      for (const input in pda.transitions[state]) {
        for (const topOfStack in pda.transitions[state][input]) {
          const { next, stack } = pda.transitions[state][input][topOfStack];
          transitionsArray.push([state, input, topOfStack, next, stack]);
        }
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
  //     const current_state = pda.initialState;
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

  //         if (pda.finalStates.includes(state)) {
  //           validStrings.add(string);
  //         }
  //         if (validStrings.size === length) {
  //           break;
  //         }

  //         for (const input of Array.from(pda.inputSymbols)) {
  //           if (pda.transitions[state][input]) {
  //             queue.push({
  //               state: pda.transitions[state][input],
  //               string: string + input,
  //             });
  //           }
  //         }
  //       }
  //       resolve(Array.from(validStrings));
  //     });
  //   };

  const stringify = () => {
    const pda_copy = {
      ...pda,
      inputSymbols: Array.from(pda.inputSymbols),
      stackSymbols: Array.from(pda.stackSymbols),
    };

    return JSON.stringify(pda_copy);
  };

  const load = (pdaString: string) => {
    const pda_copy = JSON.parse(pdaString);
    pda_copy.inputSymbols = new Set(pda_copy.inputSymbols);
    pda_copy.stackSymbols = new Set(pda_copy.stackSymbols);
    setPda(pda_copy);
  };
  const reset = () => {
    setPda({
      states: [],
      finalStates: [],
      initialState: null,
      inputSymbols: new Set<string>(),
      stackSymbols: new Set<string>(),
      transitions: {},
    });
  };

  return {
    ...pda,
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
export default usePDA;

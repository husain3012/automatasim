import { useState } from "react";
import { TuringInterface, MoveValue } from "../interfaces/turing-hook";


export const INITIAL_STACK_SYMBOL = "#";
export const BLANK_SYMBOL = "⨆";
const initialState: {
  states: string[];
  initialState: string | null;
  finalStates: string[];
  inputSymbols: Set<string>;
  tapeSymbols: Set<string>;

  transitions: Record<
    string,
    Record<
      string,
      {
        next: string;
        write: string;
        move: MoveValue;
      }
    >
  >;
} = {
  states: [],
  initialState: null,
  inputSymbols: new Set<string>(),
  transitions: {},
  tapeSymbols: new Set<string>(),
  finalStates: [],
};

const useTuring = (): TuringInterface => {
  const [TM, setTM] = useState(initialState);
  const [tapeLength, setTapeLength] = useState(100)
  const [tapeHead, setTapeHead] = useState(0);
  const TAPE = Array.from(BLANK_SYMBOL.repeat(tapeLength))

  const updateSetOfInputSymbols = () => {
    const updated_input_symbols = new Set<string>();
    const updated_stack_symbols = new Set<string>();
    for (const state in TM.transitions) {
      for (const input in TM.transitions[state]) {
        TM.transitions[state][input].write
          .split("")
          .forEach((s) => updated_stack_symbols.add(s));
      }
    }
    setTM((prev) => ({
      ...prev,
      inputSymbols: new Set(Array.from(updated_input_symbols)),
    }));
  };

  const addState = (state: string, isFinal = false, isInitial = false) => {
    // if state already exists, do not add it
    if (TM.states.includes(state)) {
      return;
    }
    const current_state = { ...TM };
    current_state.states.push(state);
    // if no initial state is set, set this state as initial
    if (isInitial && !TM.initialState) {
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

  const addTransition = (
    from: string,
    to: string,
    input: string,
    write: string,
    move: MoveValue
  ) => {
    if (input.length !== 1) {
      new Error("Invalid input");
      return;
    }
    if (write === "") write = input;

    const updatedTM = { ...TM };
    if (!updatedTM.transitions[from]) {
      updatedTM.transitions[from] = {};
    }
    updatedTM.transitions[from][input] = { next: to, write, move };

    updatedTM.inputSymbols = new Set([
      ...Array.from(updatedTM.inputSymbols),
      input,
    ]);

    setTM(updatedTM);
  };

  const removeState = (state: string) => {
    // if state does not exist, do not remove it
    if (!TM.states.includes(state)) {
      console.log("State does not exist.");
      return;
    }

    const currentState = { ...TM };

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
  const removeTransition = (
    from: string,
    on: string,
    when: string,
    to: string,
    then: string
  ) => {
    const TM_copy = { ...TM };
    try {
      const transitionReference = TM_copy.transitions[from][on][when];
      if (
        transitionReference &&
        transitionReference.next === to &&
        transitionReference.stack === then
      ) {
        delete TM_copy.transitions[from][on][when];
        setTM(TM_copy);
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
  } => {
    const path = [];

    let current_state = TM.initialState;
    let i = 0;
    for (; i < input.length; i++) {
      const char = input[i];
      const inputMatch = TM.transitions[current_state][char];
      if (!inputMatch)
        return {
          accepted: false,
          path,
        };
     
    


   

      path.push(current_state + ">" + inputMatch.next);
      TAPE[tapeHead] = inputMatch.write[0];
      

      if(inputMatch.move=="L"){
        setTapeHead(tapeHead-1)
      }else{
        if(tapeHead>=TAPE.length){
          setTapeLength(2*tapeLength)
          const newTape = [...TAPE]
          for(let j = tapeLength;j<2*tapeLength;j++){
            newTape.push(BLANK_SYMBOL);
          }
        }
        setTapeHead(tapeHead+1)
      }
    
      current_state = inputMatch.next;
    }

    if (
      TM.finalStates.includes(current_state)
    )
      return {
        accepted: true,
        path,
      };


    return {
      accepted: false,
      path,
    };
  };
  const print = (): Array<[]> => {
    const transitionsArray = [];
    for (const state in TM.transitions) {
      for (const input in TM.transitions[state]) {
          const { next, move, write } = TM.transitions[state][input];
          transitionsArray.push([state, input, write, move, next]);
        
      }
    }

    return transitionsArray;
  };

 

  const stringify = () => {
    const tm_copy = {
      ...TM,
      inputSymbols: Array.from(TM.inputSymbols),
    };

    return JSON.stringify(tm_copy);
  };

  const load = (tmString: string) => {
    const TM_copy = JSON.parse(tmString);
    TM_copy.inputSymbols = new Set(TM_copy.inputSymbols);
    setTM(TM_copy);
  };
  const reset = () => {
    setTM({
      states: [],
      initialState: null,
      inputSymbols: new Set<string>(),
      transitions: {},
      tapeSymbols: new Set<string>(),
      finalStates: [],
    });
  };

  return {
    ...TM,
    TAPE,
    tapeHead,
    addState,
    addTransition,
    removeState,
    removeTransition,
    test,
    print,
    stringify,
    load,
    reset,
    
  };
};
export default useTuring;

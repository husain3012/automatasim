
export interface TMInterface {
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
    stack?: string[];
    addState: (state: string, isFinal?: boolean, isInitial?: boolean) => void;
    addTransition: (from: string, to: string, input: string, write:string, move:"L"|"R") => void;
    removeState: (state: string) => void;
    removeTransition: (from: string, input: string) => void;
    test: (input: string) => {
      accepted: boolean;
      path: string[];
      tape: {pointer:number, tape:string[]}[]
    };
  
    print: () => string[][];
    stringify: () => string;
    load: (json: string) => void;
    reset: () => void;
  }
  

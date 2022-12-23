export interface PDAInterface {
  states: string[];
  initialState: string | null;
  stackSymbols: Set<string>;
  finalStates: string[];
  inputSymbols: Set<string>;
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
  stack?: string[];

  addState: (state: string, isFinal?: boolean, isInitial?: boolean) => void;
  addTransition: (from: string, to: string, input: string, topOfStack:string, stackOperation:string) => void;
  removeState: (state: string) => void;
  removeTransition: (from: string, on: string, when: string, to:string, then:string) => void;
  test: (input: string) => {
    accepted: boolean;
    path: string[];
    stackStates: string[][]
  };

  print: () => string[][];
  stringify: () => string;
  load: (json: string) => void;
  reset: () => void;
}

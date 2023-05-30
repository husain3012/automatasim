export type MoveValue = "L" | "R";
export interface TuringInterface {
  states: string[];
  initialState: string | null;
  finalStates: string[];
  inputSymbols: Set<string>;
  tapeSymbols: Set<string>;
  TAPE: string[];
  tapeHead: number;

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

  addState: (state: string, isFinal?: boolean, isInitial?: boolean) => void;
  addTransition: (
    from: string,
    to: string,
    input: string,
    write: string,
    move: MoveValue
  ) => void;
  removeState: (state: string) => void;
  removeTransition: (
    from: string,
    on: string,
    when: string,
    to: string,
    then: string
  ) => void;
  test: (input: string) => {
    accepted: boolean;
    path: string[];
  };

  print: () => string[][];
  stringify: () => string;
  load: (json: string) => void;
  reset: () => void;
}

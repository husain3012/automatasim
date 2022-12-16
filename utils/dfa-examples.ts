const DFA_examples = [
  {
    id: 1,
    name: "a+",
    description:
      "Accepts strings that contains atleast one a, over the alphabet {a, b}",
    data: {
      states: ["Q1", "Q2"],
      initialState: "Q1",
      finalStates: ["Q2"],
      inputSymbols: ["a", "b"],
      transitions: { Q1: { a: "Q2", b: "Q1" }, Q2: { a: "Q2", b: "Q2" } },
    },
    type:"dfa"
  },
  {
    id: 2,
    name: "a*b*",
    description:
      "Accepts strings that contains atleast zero or more a OR zero or more b, over the alphabet {a, b}",
    data: {
      states: ["A", "B", "C"],
      initialState: "A",
      finalStates: ["A", "B", "C"],
      inputSymbols: ["a", "b"],
      transitions: { A: { a: "B", b: "C" }, B: { a: "B" }, C: { b: "C" } },
    },
    type:"dfa"
  },
  {
    id: 3,
    name: "a*(b* + c*)d*",
    description:
      "Accepts strings that contains atleast zero or more a OR zero or more b OR zero or more c followed by zero or more d, over the alphabet {a, b, c, d}",
    data: {
      states: ["q0", "q1", "q2", "q3"],
      initialState: "q0",
      finalStates: ["q0", "q1", "q2", "q3"],
      inputSymbols: ["a", "b", "d", "c"],
      transitions: {
        q0: { a: "q0", b: "q1", d: "q2", c: "q3" },
        q1: { b: "q1", d: "q2" },
        q2: { d: "q2" },
        q3: { c: "q3", d: "q2" },
      },
    },
    type:"dfa"
  },
  {
    id: 4,
    name: "Binary strings divisible by 5",
    description: "Accepts binary strings that are divisible by 5",
    data: {
      states: ["q1", "q2", "q3", "q4", "q0"],
      initialState: "q0",
      finalStates: ["q0"],
      inputSymbols: ["0", "1"],
      transitions: {
        q1: { "0": "q2", "1": "q3" },
        q2: { "0": "q4", "1": "q0" },
        q3: { "0": "q1" },
        q4: { "0": "q3", "1": "q4" },
        q0: { "0": "q0", "1": "q1" },
      },
    },
    type:"dfa"
  },
];

export default DFA_examples;

const handler = async (req, res) => {
  switch (req.method) {
    case "POST":
      generateValidStrings(req, res);
      break;
    default:
      res.status(405).end();
      break;
  }
};

const generateValidStrings = async (req, res) => {
  const {
    transitionTable,
    initialState,
    finalStates,
    inputSymbols,
  }: {
    transitionTable: any;
    initialState: string;
    finalStates: string[];
    inputSymbols: string[];
  } = req.body;
  let validStrings = new Set<string>();
  let currentString = "";
  let current_state = initialState;
  let length = 1000;
  let queue = [];
  queue.push({ state: current_state, string: currentString });
  let iterations = 0;
  while (queue.length > 0 && iterations < length) {
    let { state, string } = queue.shift();
    if (finalStates.includes(state)) {
      validStrings.add(string);
    }
    for (const input of Array.from(inputSymbols)) {
      if (transitionTable[state][input]) {
        queue.push({
          state: transitionTable[state][input],
          string: string + input,
        });
      }
    }
    iterations++;
  }
  res.json({ data: Array.from(validStrings) });
};

export default handler;

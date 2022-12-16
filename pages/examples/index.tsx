import React from "react";
import { toast } from "react-hot-toast";
import Layout from "../../components/Layout";
import DFA_examples from "../../utils/dfa-examples";

const Examples = () => {
  const beautifyJSON = (json: string) => {
    // make json string pretty
    const beautified = JSON.stringify(JSON.parse(json), null, 2);
    return beautified;
  };

  return (
    <Layout title="Automata | Examples">
      <h1 className="text-4xl p-4 text-center">Examples</h1>
      <div className="px-4 sm:px-24 shadow-sm m-auto flex flex-wrap gap-4 p-4 justify-center">
        {DFA_examples.map((example) => (
          <div
            key={example.id}
            className="card w-80  bg-base-200 shadow-xl p-2 "
          >
            <div className="mockup-code max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-base-200">
              {beautifyJSON(
                typeof example.data !== "string"
                  ? JSON.stringify(example.data)
                  : example.data
              )
                .split("\n")
                .map((line, i) => (
                  <code key={i}>
                    <pre data-prefix="$">{line}</pre>
                  </code>
                ))}
            </div>
            <div className="card-body">
              <div className="badge badge-accent badge-outline">
                {example.type}
              </div>
              <h2 className="card-title">{example.name}</h2>
              <p>{example.description}</p>
              <div className="card-actions justify-end">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      typeof example.data !== "string"
                        ? JSON.stringify(example.data)
                        : example.data
                    );
                    toast.success("Copied to clipboard!");
                  }}
                  className="btn btn-primary"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Examples;

import { ExampleInterface } from "../../interfaces/example";
import { toast } from "react-hot-toast";
import { useState } from "react";
import Link from "next/link";

const ExampleCard = ({ example }: { example: ExampleInterface }) => {
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const copyToClipboardHandler = async () => {
    setCopiedToClipboard(true);

    navigator.clipboard.writeText(
      typeof example.data !== "string"
        ? JSON.stringify(example.data)
        : example.data
    );
    toast.success("Copied to clipboard!");
    await new Promise((resolve) =>
      setTimeout(() => resolve(setCopiedToClipboard(false)), 2000)
    );
  };
  const beautifyJSON = (json: string) => {
    // make json string pretty
    const beautified = JSON.stringify(JSON.parse(json), null, 2);
    return beautified;
  };
  return (
    <div key={example.id} className="card w-80  bg-base-200 shadow-xl p-2 ">
      <div className="mockup-code max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-base-200">
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
        <div className="badge badge-accent badge-outline ">{example.type}</div>
        <h2 className="card-title">{example.name}</h2>

        <p>{example.description}</p>
        {example.author && (
          <div className="flex flex-row justify-end items-center border-2 border-accent rounded-full p-2 w-fit ml-auto">
            <div className="avatar">
              <div className="w-6 rounded-full">
                <img src={example.author.avatar} referrerPolicy="no-referrer" />
              </div>
            </div>
            <div className="ml-2">
              <p className="text-base font-semibold">
                {example.author.name.split(" ")[0]}
              </p>
            </div>
          </div>
        )}

        <div className="card-actions justify-end">
          <button
            onClick={copyToClipboardHandler}
            className={`btn  ${
              copiedToClipboard ? "btn-success" : "btn-primary"
            }`}
          >
            {copiedToClipboard ? "Copied!" : "Copy"}
          </button>
          <Link
            href={`/${example.type}?load=${example.id}`}
            className="btn btn-outline btn-primary"
          >
            Load in Editor
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExampleCard;

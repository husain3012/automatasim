import React from "react";
import Layout from "../../components/Layout";

import { ExampleInterface } from "../../interfaces/example";
import ExampleCard from "../../components/Examples/ExampleCard";
import { getExamplePosts } from "../../services/posts";
const Examples = ({ examples }: { examples: ExampleInterface[] }) => {
  return (
    <Layout title="Automata | Examples">
      <h1 className="text-4xl p-4 text-center">Examples</h1>
      <div className="px-4 sm:px-24 shadow-sm m-auto flex flex-wrap gap-4 p-4 justify-center">
        {examples.map((example) => (
          <ExampleCard key={example.id} example={example} />
        ))}
      </div>
    </Layout>
  );
};

export const getServerSideProps = async () => {
  const resp = await getExamplePosts();

  return {
    props: {
      examples: resp,
    },
};
};

export default Examples;

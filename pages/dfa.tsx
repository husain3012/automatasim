import React from "react";
import Layout from "../components/Layout";
import DFA from "../components/DFA/DFA";
import { getPostById } from "../services/posts";

const Dfa = () => {
  return (
    <Layout title="Automata | DFA">
      <DFA  />
    </Layout>
  );
};

export const getServerSideProps = async (context) => {
  const loadQuery = context.query?.load;
  if (!loadQuery)
    return {
      props: {},
    };
  const getExample = await getPostById(loadQuery);
  return {
    props: {
      load: getExample,
    },
  };
};

export default Dfa;

import React from "react";
import Layout from "../components/Layout";
import DFA from "../components/DFA/DFA";
import { getExampleById } from "../services/getExamples";

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
  const getExample = await getExampleById(loadQuery);
  return {
    props: {
      load: getExample,
    },
  };
};

export default Dfa;

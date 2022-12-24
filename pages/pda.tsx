import React from "react";
import Layout from "../components/Layout";
import PDA from "../components/PDA/PDA";
// import { getPostById } from "../services/posts";

const Pda = () => {
  return (
    <Layout title="Automata | PDA">
      <PDA  />
    </Layout>
  );
};

// export const getServerSideProps = async (context) => {
//   const loadQuery = context.query?.load;
//   if (!loadQuery)
//     return {
//       props: {},
//     };
//   const getExample = await getPostById(loadQuery);
//   return {
//     props: {
//       load: getExample,
//     },
//   };
// };

export default Pda;

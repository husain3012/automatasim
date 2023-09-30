import React from "react";
import Layout from "../components/Layout";
import TM from "../components/TM/TM";
// import { getPostById } from "../services/posts";

const Tm = () => {
  return (
    <Layout title="Automata | TM">
      <TM  />
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

export default Tm;

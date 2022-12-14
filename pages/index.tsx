import Link from "next/link";
import Layout from "../components/Layout";

const IndexPage = () => (
  <Layout title="Automata">
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <img
          src="/images/automatasim.png"
          className="max-w-sm w-60 md:w-auto rounded-lg shadow-2xl"
        />
        <div>
          <h1 className="text-5xl font-bold">Simulator for automatons</h1>
          <p className="py-6">
            This web application is a simulator for automatons. You can build
            and simulate Definite Finite Automata, Push Down Automata and Turing
            Machines.
          </p>
          <Link href="/dfa" className="btn btn-primary">
            Build
          </Link>
        </div>
      </div>
    </div>
  </Layout>
);

export default IndexPage;

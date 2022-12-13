import Link from "next/link";
import Layout from "../components/Layout";

const IndexPage = () => (
  <Layout title="Automata">
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <img
          src="https://images.unsplash.com/photo-1572435555646-7ad9a149ad91?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
          className="max-w-sm rounded-lg shadow-2xl"
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

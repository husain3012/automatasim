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
            and simulate{" "}
            <Link className="underline" href="/dfa">
              Definite Finite Automata
            </Link>
            , &nbsp;
            <span className="tooltip" data-tip="Coming Soon">
              <Link className="underline" href="/">
                Push Down Automates
              </Link>
            </span>
            &nbsp; and &nbsp;
            <span className="tooltip" data-tip="Coming Soon">
              <Link className="underline" href="/">
                Turing Machines.
              </Link>
            </span>
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

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
        <div >
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
          <div className="flex gap-2">
            <Link href="/dfa" className="btn btn-primary">
              Build
            </Link>
            <Link
              href="/#how_to_use"
              className="btn gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z"
                />
              </svg>
              Watch Tutorial
            </Link>
          </div>
        </div>
      </div>
    </div>
    <div id="how_to_use" className="p-4 sm:p-16 phone-1 flex flex-col sm:flex-row justify-center items-center w-3/4 m-auto">
      <h1 className="text-5xl font-bold text-center sm:text-left m-4 ">How to use?</h1>

      <iframe
        className="w-4/5 sm:w-full sm:h-96 m-4"
        src="https://www.youtube.com/embed/O04a2a7dwb4"
        title="DFA tutorial for AutomataSim"
        allowFullScreen={true}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      ></iframe>
    </div>
  </Layout>
);

export default IndexPage;

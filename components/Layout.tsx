import React, { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import Navbar from "./Layout/Navbar";
import { AiFillGithub, AiFillLinkedin, AiFillInstagram } from "react-icons/ai";
import { toast, Toaster } from "react-hot-toast";
import Router from "next/router";
import AuthWrapper from "./AuthWrapper";

interface Props {
  children?: ReactNode;
  title?: string;
}

const Layout = ({ children, title = "Automata" }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    Router.events.on("routeChangeStart", () => {
      setIsLoading(true);
    });

    Router.events.on("routeChangeComplete", () => {
      setIsLoading(false);
    });

    Router.events.on("routeChangeError", () => {
      toast.error("Error loading page!");
      setIsLoading(false);
    });
  }, [Router]);

  return (
    <React.Fragment>
      <progress
        className={`progress progress-primary z-10  bg-transparent  w-screen fixed transition-all ${
          isLoading ? " opacity-70" : " opacity-0"
        }`}
      ></progress>

      <AuthWrapper>
        <div className="">
          <Head>
            <title>{title}</title>
            <meta charSet="utf-8" />
            <meta
              name="viewport"
              content="initial-scale=1.0, width=device-width"
            />
            <meta name="title" content={title}/>
            <meta
              name="description"
              content="Build, simulate, and share automatons like DFA, PDA, and Turing Machines on our website. Our user-friendly interface makes it easy for students and professionals alike to learn and experiment with these powerful tools for formal language theory."
            />
            <meta
              name="keywords"
              content="automatons, DFA, PDA, Turing Machines, formal language theory, simulation, computer science, education, programming, software"
            />
            <meta name="robots" content="index, follow" />

            <link
              rel="apple-touch-icon"
              sizes="180x180"
              href="/apple-touch-icon.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="32x32"
              href="/favicon-32x32.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="16x16"
              href="/favicon-16x16.png"
            />
            <link rel="manifest" href="/site.webmanifest" />
          </Head>

          <header>
            <Navbar />
          </header>
          <Toaster />
          <div className="min-h-screen min-w-screen px-2">{children}</div>
          <footer className="footer footer-center p-10 bg-base-200 text-base-content rounded">
            <div className="grid grid-flow-col gap-4">
              <Link href="/#about" className="link link-hover">
                About
              </Link>
              <Link
                href="mailto:husainshahidrao@gmail.com"
                className="link link-hover"
              >
                Contact
              </Link>
            </div>
            <div>
              <div className="grid grid-flow-col gap-4 text-xl">
                <Link
                  href="https://github.com/husain3012"
                  target="_blank"
                  rel="noreferrer"
                >
                  <AiFillGithub />
                </Link>
                <Link
                  href="https://www.linkedin.com/in/husain3012/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <AiFillLinkedin />
                </Link>
                <Link
                  href="https://www.instagram.com/_husain_3012/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <AiFillInstagram />
                </Link>
              </div>
            </div>
            <div>
              <p>Husain 🌼</p>
            </div>
          </footer>
        </div>
      </AuthWrapper>
    </React.Fragment>
  );
};

export default Layout;

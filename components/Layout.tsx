import React, { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import Navbar from "./Layout/Navbar";
import { AiFillGithub, AiFillLinkedin, AiFillInstagram } from "react-icons/ai";
import { toast, Toaster } from "react-hot-toast";
import Router from "next/router";
import AuthWrapper from "./AuthWrapper";
import { useRecoilValue } from "recoil";
import { loadingAtom } from "../atom/loadingAtom";
interface Props {
  children?: ReactNode;
  title?: string;
}

const Layout = ({ children, title = "Automata" }: Props) => {
  const loadingState = useRecoilValue(loadingAtom);
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
        className={`progress progress-primary   bg-transparent  w-screen fixed transition-all ${
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

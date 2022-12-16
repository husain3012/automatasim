import React, { ReactNode } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import Navbar from './Layout/Navbar'
import { AiFillGithub, AiFillLinkedin, AiFillInstagram } from 'react-icons/ai'
interface Props {
  children?: ReactNode
  title?: string
}

const Layout = ({ children, title = 'Automata' }: Props) => (
  <React.Fragment>
    <div className="">
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header>
        <Navbar />
      </header>
      <div className="min-h-screen min-w-screen">{children}</div>
    </div>
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
          <Link href="https://github.com/husain3012" target="_blank" rel="noreferrer">
            <AiFillGithub />
          </Link>
          <Link href="https://www.linkedin.com/in/husain3012/" target="_blank" rel="noreferrer">
            <AiFillLinkedin />
          </Link>
          <Link href="https://www.instagram.com/_husain_3012/" target="_blank" rel="noreferrer">
            <AiFillInstagram />
          </Link>
        </div>
      </div>
      <div>
        <p>Husain 🌼</p>
      </div>
    </footer>
  </React.Fragment>
)

export default Layout

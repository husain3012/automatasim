import Link from 'next/link'
import React from 'react'

const Navbar = () => {
  return (
    <nav className="navbar bg-base-100 border-b-base-300 border-b-2">
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl">
          <Link href="/">Automata</Link>
        </a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal p-0">
        <li>
            <a>
              <Link href="/examples">Examples</Link>
            </a>
          </li>
          <li>
            <a>
              <Link href="/dfa">DFA</Link>
            </a>
          </li>
          {/* <li>
            <a>Turing Machine</a>
          </li> */}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar

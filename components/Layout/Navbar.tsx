import Link from "next/link";
import React from "react";
import { toast } from "react-hot-toast";
import { AiOutlineGoogle, AiOutlineMenu } from "react-icons/ai";
import { useRecoilValue } from "recoil";
import { authState } from "../../atom/authAtom";
import { logIn, logOut } from "../../firebase/auth";

const Navbar = () => {
  const user = useRecoilValue(authState);
  const logoutHandler = async () => {
    const resp = await logOut();
    if (resp) {
      toast.success("Logged out successfully");
      return;
    }
    toast.error("Something went wrong");
  };
  const loginHandler = async () => {
    const resp = await logIn();
    if (resp) {
      toast.success("Logged in successfully");
      return;
    }
    toast.error("Something went wrong");
  };

  return (
    <nav className="navbar bg-base-100 border-b-base-300 border-b-2">
      <div className="flex-1">
        <Link className="btn btn-ghost normal-case text-xl" href="/">
          Automata
        </Link>
      </div>
      <div className=" hidden sm:block flex-none border-r-2 border-base-200 px-2">
        <ul className=" menu   menu-horizontal p-0">
          <li>
            <Link href="/examples">Examples</Link>
          </li>
          <li>
            <Link href="/community">Community</Link>
          </li>
          <li>
            <Link href="/dfa">DFA</Link>
          </li>
          {/* <li>
            <a>Turing Machine</a>
          </li> */}
        </ul>
      </div>
      {/* mobile view */}
      <div className=" dropdown  dropdown-end border-r-2 border-base-100 px-2 sm:hidden">
        <label tabIndex={0} className="btn btn-ghost">
          <AiOutlineMenu />
        </label>
        <ul className="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-52">
          <li>
            <Link href="/examples">Examples</Link>
          </li>
          <li>
            <Link href="/community">Community</Link>
          </li>
          <li>
            <Link href="/dfa">DFA</Link>
          </li>
          {/* <li>
            <a>Turing Machine</a>
          </li> */}
        </ul>
      </div>
      {/* mobile view ends */}

      {user ? (
        <div className="dropdown dropdown-end mx-2">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img src={user.photoURL} />
            </div>
          </label>
          <ul
            tabIndex={0}
            className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
          >
            <li>
              <button
                onClick={logoutHandler}
                className=" btn  btn-outline  btn-warning"
              >
                Logout
              </button>
            </li>
            {/* <li>
              <a>Settings</a>
            </li>
            <li>
              <a>Logout</a>
            </li> */}
          </ul>
        </div>
      ) : (
        <button onClick={loginHandler} className="btn btn-secondary">
          Sign in
          
          <span className="px-2 text-lg">
            <AiOutlineGoogle />
          </span>
        </button>
      )}
    </nav>
  );
};

export default Navbar;

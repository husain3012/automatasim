import Link from "next/link";
import React from "react";
import { toast } from "react-hot-toast";
import { AiOutlineGoogle } from "react-icons/ai";
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
      <div className="flex-none border-r-2 border-base-200 px-2">
        <ul className="menu menu-horizontal p-0">
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
      {user ? (
        <div className="dropdown  text-center mr-2">
          <label tabIndex={0} className="avatar cursor-pointer ">
            {
              <span className=" text-lg w-28 text-ellipsis whitespace-nowrap overflow-hidden m-auto px-2">
                {user.displayName.split(" ")[0]}
              </span>
            }
            <div className="w-12 rounded-full">
              <img referrerPolicy="no-referrer" src={user.photoURL} />
            </div>
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-full m-2"
          >
            <li>
              <button
                onClick={logoutHandler}
                className=" btn  btn-outline  btn-warning"
              >
                Logout
              </button>
            </li>
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

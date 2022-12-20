import React, { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useSetRecoilState } from "recoil";
import { authState } from "../atom/authAtom";

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const setUser = useSetRecoilState(authState);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      
      if (user) {
        setUser(JSON.parse(JSON.stringify(user)));
      } else {
        setUser(null);
      }
    });
    return () => {
      setUser(null);
      unsub();
    };
  }, []);
  return <>{children}</>;
};

export default AuthWrapper;

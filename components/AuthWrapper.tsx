import React, { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useSetRecoilState } from "recoil";
import { authState } from "../atom/authAtom";
import { loadingAtom } from "../atom/loadingAtom";

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const setUser = useSetRecoilState(authState);
  const setLoading = useSetRecoilState(loadingAtom);
  useEffect(() => {
    setLoading((prev) => ({ ...prev, auth: true }));
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(JSON.parse(JSON.stringify(user)));
      } else {
        setUser(null);
      }
      setLoading((prev) => ({ ...prev, auth: false }));
    });
    return () => {
      setUser(null);
      unsub();
    };
  }, []);
  return <>{children}</>;
};

export default AuthWrapper;

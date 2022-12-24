import { atom } from "recoil";
// import { User as FirebaseUser } from "@firebase/auth-types";
const loadingAtom = atom({
  key: "loading", // unique ID (with respect to other atoms/selectors)
  default: {
    auth: true,
  },
});
export { loadingAtom };

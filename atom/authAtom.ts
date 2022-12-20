import { atom } from "recoil";
import { User as FirebaseUser } from "firebase/auth";
// import { User as FirebaseUser } from "@firebase/auth-types";
const authState = atom({
  key: "auth", // unique ID (with respect to other atoms/selectors)
  default: null as FirebaseUser, // default value (aka initial value)
});
export { authState };


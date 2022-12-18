import { db } from "../firebase/firebase";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
export const getExamples = async () => {
  const exampleCols = collection(db, "examples");
  const exampleSnapshot = await getDocs(exampleCols);

  const exampleList = exampleSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return exampleList;
};

export const getExampleById = async (id: string) => {
  const docRef = doc(db, "examples", id);

  if (!docRef) return null;
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    console.log("Error getting document:", error);
    
  }
};

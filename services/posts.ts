import { db } from "../firebase/firebase";
import dayjs from "dayjs";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  setDoc,
  addDoc,
  where,
  query,
  Timestamp,
} from "firebase/firestore";
import { ExampleInterface } from "../interfaces/example";
export const getCommunityPosts = async (): Promise<ExampleInterface[]> => {
  const communityCols = collection(db, "posts");
  const communityQuery = query(communityCols, where("example", "==", false));
  const communitySnapshot = await getDocs(communityQuery);

  const communityList = communitySnapshot.docs.map((doc) => {
    const data = doc.data();
    const createdAt = new Timestamp(
      data.createdAt?.seconds,
      data.createdAt?.nanoseconds
    ).toString();
    return {
      id: doc.id,
      type: data.type as string,
      name: data.name as string,
      description: data.description as string,
      data: data.data as string,
      createdAt: createdAt as string,
      ...(data.author
        ? {
            author: {
              id: data.author.id as string,
              name: data.author.name as string,
              avatar: data.author.avatar as string,
            },
          }
        : {}),
    };
  });
  return communityList;
};

export const getExamplePosts = async (): Promise<ExampleInterface[]> => {
  const exampleCols = collection(db, "posts");
  // get posts where example is true
  const exampleQuery = query(exampleCols, where("example", "==", true));
  const exampleSnapshot = await getDocs(exampleQuery);

  const exampleList = exampleSnapshot.docs.map((doc) => {
    const data = doc.data();
    const createdAt = new Timestamp(
      data.createdAt?.seconds,
      data.createdAt?.nanoseconds
    ).toString();
    return {
      id: doc.id,
      type: data.type as string,
      name: data.name as string,
      description: data.description as string,
      data: data.data as string,
      createdAt: createdAt as string,
    };
  });
  return exampleList;
};

export const postCommunityPost = async (post: any) => {
  const communityCols = collection(db, "posts");
  const docRef = await addDoc(communityCols, {
    ...post,
    example: false,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};

export const getPostById = async (id: string) => {
  const docRef = doc(db, "posts", id);

  if (!docRef) return null;
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const createdAt = new Timestamp(
        data.createdAt?.seconds,
        data.createdAt?.nanoseconds
      ).toString();
      return {
        id: docSnap.id,
        type: data.type as string,
        name: data.name as string,
        description: data.description as string,
        data: data.data as string,
        createdAt: createdAt as string,
        ...(data.author
          ? {
              id: data.author.id as string,
              name: data.author.name as string,
              avatar: data.author.avatar as string,
            }
          : {}),
      };
    } else {
      return null;
    }
  } catch (error) {
    console.log("Error getting document:", error);
  }
};

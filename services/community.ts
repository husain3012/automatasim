import { db } from "../firebase/firebase";
import dayjs from "dayjs";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  setDoc,
  addDoc,
} from "firebase/firestore";
import { ExampleInterface } from "../interfaces/example";
export const getCommunityPosts = async (): Promise<ExampleInterface[]> => {
  const communityCols = collection(db, "community");
  const communitySnapshot = await getDocs(communityCols);

  const communityList = communitySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      type: data.type as string,
      name: data.name as string,
      description: data.description as string,
      data: data.data as string,
      createdAt: data.createdAt as string,
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

export const postCommunityPost = async (post: any) => {
  const communityCols = collection(db, "community");
  const docRef = await addDoc(communityCols, {
    ...post,
    createdAt: dayjs().toDate(),
  });
  return docRef.id;
};

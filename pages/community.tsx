import React, { useState } from "react";
import { toast } from "react-hot-toast";
import Layout from "../components/Layout";
import ExampleCard from "../components/Examples/ExampleCard";
import { ExampleInterface } from "../interfaces/example";
import { getCommunityPosts, postCommunityPost } from "../services/posts";
import { useRecoilValue } from "recoil";
import { authState } from "../atom/authAtom";
import dayjs from "dayjs";

const Community = ({ posts }: { posts: ExampleInterface[] }) => {
  const [communityPosts, setCommunityPosts] = useState(posts);
  const auth = useRecoilValue(authState);
  const getCommunityPostsHandler = async () => {
    const resp = await getCommunityPosts();
    setCommunityPosts(resp);
  };

  const isValidJson = (str) => {
    if (!str) return true;
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  };
  const [postValues, setPostValues] = useState({
    name: "",
    type: "",
    description: "",
    data: "",
  });

  const submitPostHandler = async (e) => {
    e.preventDefault();
    // check if automaton is valid json
    if (!isValidJson(postValues.data)) {
      toast.error("Invalid automaton");
      return;
    }
    // check if all fields are filled
    try {
      const resp = await postCommunityPost({
        ...postValues,
        author: {
          id: auth.uid,
          name: auth.displayName,
          avatar: auth.photoURL,
        },
      });
      toast.success("Posted!");
      await getCommunityPostsHandler();
      setIsPostModalOpen(false);

    } catch (error) {
      console.log(error);
      toast.error("Unknown error!");
    }
  };

  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  return (
    <Layout>
      <div className="container mx-auto flex my-2 justify-between items-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl my-2 font-bold">Community</h1>
          <p className="">Automatons posted by the community</p>
        </div>
        <div className="ml-auto">
          <div
            className={` ${
              !auth ? "tooltip" : ""
            } tooltip-secondary tooltip-bottom`}
            data-tip="Login!"
          >
            <button
              disabled={!auth}
              className="btn btn-secondary"
              onClick={() => setIsPostModalOpen(true)}
            >
              Post Yours!
            </button>
          </div>
        </div>
      </div>
      <div className="divider"></div>

      <div className="px-4 sm:px-24 shadow-sm m-auto flex flex-wrap gap-4 p-4 justify-center w-full">
        {communityPosts.map((post) => (
          <ExampleCard key={post.id} example={post} />
        ))}
      </div>

      <div className={`modal ${isPostModalOpen ? "modal-open" : ""}`}>
        <div className="modal-box">
          <form className="container mx-auto">
            <div className="flex gap-2">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">
                    Title <span className="text-red-500">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Title"
                  className="input input-bordered"
                  required
                  value={postValues.name}
                  onChange={(e) =>
                    setPostValues({ ...postValues, name: e.target.value })
                  }
                />
              </div>
              <div className="form-control ml-auto ">
                <label className="label">
                  <span className="label-text">
                    Type <span className="text-red-500">*</span>
                  </span>
                </label>
                <select
                  value={postValues.type}
                  onChange={(e) =>
                    setPostValues({ ...postValues, type: e.target.value })
                  }
                  required
                  className="select select-accent w-full max-w-xs"
                >
                  <option value="">Select Type</option>
                  <option value="dfa">DFA</option>
                  <option value="pda">PDA</option>
                  {/* <option value="tm">Turing Machine</option> */}
                </select>
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                spellCheck="false"
                placeholder="Description"
                value={postValues.description}
                onChange={(e) =>
                  setPostValues({ ...postValues, description: e.target.value })
                }
                className="textarea h-24 textarea-bordered"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">
                  Automaton <span className="text-red-500">*</span>
                </span>
              </label>
              <div className="mockup-code  text-primary-content ">
                <div className="px-4">
                  <code>
                    <textarea
                      rows={5}
                      placeholder={`{\n\t"states":[]\n\t...\n}`}
                      className={`textarea textarea-bordered bg-transparent  border-2  focus:outline-none w-full scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-base-200 ${
                        isValidJson(postValues.data)
                          ? "border-base-200"
                          : "border-error"
                      }`}
                      value={postValues.data}
                      onChange={(e) =>
                        setPostValues({
                          ...postValues,
                          data: e.target.value,
                        })
                      }
                    />
                  </code>
                </div>
              </div>
            </div>
          </form>
          <div className="modal-action">
            <button
              onClick={() => setIsPostModalOpen(false)}
              className="btn btn-ghost"
            >
              Cancel
            </button>

            <button
              disabled={
                postValues.name === "" ||
                postValues.type === "" ||
                postValues.data === ""
              }
              onClick={submitPostHandler}
              className="btn"
            >
              Post!
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps = async () => {
  const resp = await getCommunityPosts();

  return {
    props: {
      posts: resp,
    },
  };
};

export default Community;

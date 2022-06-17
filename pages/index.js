import { useState, useEffect } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { listPosts } from "./../src/graphql/queries";
import Link from "next/link";
import { newOnCreatePost } from "../src/graphql/subscriptions";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [post, setPost] = useState([]);
  let subOncreate;

  function setUpSubscriptions() {
    subOncreate = API.graphql(graphqlOperation(newOnCreatePost)).subscribe({
      next: (postData) => {
        console.log(postData);
        setPost(postData);
      },
    });
  }

  useEffect(() => {
    setUpSubscriptions();
    return () => {
      subOncreate.unsubscribe();
    };
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [post]);

  async function fetchPosts() {
    const postData = await API.graphql({
      query: listPosts,
    });

    setPosts(postData.data.listPosts.items);
  }
  return (
    <div>
      <h1
        className="text-sky-400 text-3xl 
        font-bold tracking-wide mt-6 mb-2"
      >
        My Posts
      </h1>
      {posts.map((post, index) => (
        <Link key={index} href={`/posts/${post.id}`}>
          <div className="cursor-pointer border-b border-gray-300 mt-8 pb-4">
            <h2 className="text-xl font-semibold" key={index}>
              {post.title}
            </h2>
            <p className="text-gray-500 mt-2">Author: {post.username}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

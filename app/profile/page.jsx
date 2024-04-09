'use client'

import Profile from "@components/Profile";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const MyProfile = () => {
  const router = useRouter();

  const {data: session} = useSession();

  const [posts, setPosts] = useState([]);
  useEffect(() => {
    //call when page first load
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${session?.user.id}/posts`);
      const data = await response.json();
          
      setPosts(data);
    }
    if (session?.user.id) fetchPosts();
  }, []);
  const handleEdit = async (post) => {
    //navigate user to a page
    console.log(post._id)
    router.push(`/update-prompt?id=${post._id}`);
  }

  const handleDelete = async (post) => {
    //verify user's decision to delete
    const hasConfirmed = confirm("Are you sure you want to delete this prompt?");
  
    if(hasConfirmed) {
      //after confirmation delete post
      try {
        console.log(post._id)
        await fetch(`/api/prompt/${post._id.toString()}`, {
          method: "DELETE"
        })

        const filteredPosts = posts.filter((p) => p._id !== post._id);

        setPosts(filteredPosts);
      } catch (error) {
        console.log(error)
      }
    }
  }
  return (
    <Profile 
      name='My'
      desc='welcome to your personalized profile page'
      data={posts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  )
}

export default MyProfile
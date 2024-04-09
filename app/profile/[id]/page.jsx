"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import Profile from "@components/Profile";

//Other Users profile page
const UserProfile = ({ params }) => {
  const searchParams = useSearchParams();
  const userName = searchParams.get("name");

  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
        //fetch and set the user's posts
      const response = await fetch(`/api/users/${params?.id}/posts`);
      const data = await response.json();
        
      setUserPosts(data);
    };
    //only fetch users posts upon request
    if (params?.id) fetchPosts();
  }, [params.id]);

  return (
    //display the user profile
    <Profile
      name={userName}
      desc={`Welcome to ${userName}'s personalized profile page. Explore ${userName}'s exceptional prompts and be inspired by the power of their imagination`}
      data={userPosts}
    />
  );
};

export default UserProfile;
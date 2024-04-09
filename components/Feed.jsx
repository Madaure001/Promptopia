'use client'

import { useEffect, useState } from "react";
import PromptCard from './PromptCard';


const PromptCardList = ({data, handleTagClick}) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard 
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  )
}
const Feed = () => {
  const [posts, setPosts] = useState([]);

  const [searchText, setSearchText] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);

    // we first need a way to filter prompts
  const filterPrompts = (searchtext) => {
    const regex = new RegExp(searchtext, "i"); // 'i' flag for case-insensitive search
    return posts.filter(
      (item) =>
        regex.test(item.creator.username) ||
        regex.test(item.tag) ||
        regex.test(item.prompt)
    );
  };

  //we handle input change
  const handleSearchChange = (e) => {
    //we do not need to connect to DB, just filter prompts
    clearTimeout(searchTimeout);
    //we target the input value
    setSearchText(e.target.value);

    // debounce method
    setSearchTimeout(
      setTimeout(() => {
        const searchResults = filterPrompts(e.target.value);
        setSearchedResults(searchResults);
      }, 500)
    );
  }

  //handle the tag click and filter prompts
  const handleTagClick = (tagName) => {
    setSearchText(tagName);

    const searchResult = filterPrompts(tagName);
    setSearchedResults(searchResult);
  };

  useEffect(() => {
    //call when page first load
    const fetchPosts = async () => {
      const response = await fetch("/api/prompt");
      const data = await response.json();
      
      setPosts(data);
    }
    fetchPosts();
  }, []);

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input type="text"
          placeholder="Search for a tag or a username"
          value={searchText}  
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>
       {/* All Prompts */}
       {searchText ? (
        <PromptCardList
          data={searchedResults}
          handleTagClick={handleTagClick}
        />
        ) : (
          <PromptCardList data={posts} handleTagClick={handleTagClick} />
        )}
    </section>
  )
}

export default Feed;
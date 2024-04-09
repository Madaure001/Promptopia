'use client'

import { useSession } from "next-auth/react"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"

const PromptCard = ({post, handleTagClick, handleEdit, handleDelete}) => {
    const {data: session} = useSession();
    const pathName = usePathname();
    const router = useRouter();
    const [copied, setCopied] = useState("");
    //set copied prompt to clipboard
    const handleCopy = () => {
        setCopied(post.prompt);
        navigator.clipboard.writeText(post.prompt);
        setTimeout(() => setCopied(""), 3000);
    }

    //handle the click on the prompt to redirect to user profile
    const handleProfileClick = () => {
        console.log(post);
    
        if (post.creator._id === session?.user.id) return router.push("/profile");
    
        router.push(`/profile/${post.creator._id}?name=${post.creator.username}`);
      };

  return (
    <div className="prompt_card">
        <div className="flex justify-betwee items-start gap-5">
            <div 
                onClick={handleProfileClick}
                className="flex-1 flex justify-start items-center gap-3 cursor-pointer"
            >
                <Image
                    src={post.creator.image}
                    width={40}
                    height={40}
                    alt='user_image'
                    className='rounded-full object-contain'
                />
                <div className="flex flex-col">
                    <h3 className='font-satoshi font-semibold text-gray-900'>
                        {post.creator.username}
                    </h3>
                    <p className="font-inner text-sm text-gray-500">
                        {post.creator.email}
                    </p>
                </div>
            </div>
            <div className="copy_btn" onClick={handleCopy}>
                <Image 
                    src={copied == post.prompt
                        ? '/assets/icons/tick.svg'
                        : '/assets/icons/copy.svg'
                    }
                    height={12}
                    width={12}
                    alt={copied === post.prompt ? "tick_icon" : "copy_icon"}
                />
            </div>
        </div>
        <p className="my-4 font-satoshi text-sm text-gray-700">{post.prompt}</p>
        <p 
            //ensure we do have the tag. if we do we develop similar text
            onClick={() => handleTagClick && handleTagClick(post.tag)}
            className="font-inner text-sm blue_gradient cursor-pointer"
        >
            #{post.tag}
        </p>
        {session?.user.id === post.creator._id && pathName === '/profile' && (
            <div className="mt-5 flex-center gap-4 border-t border-gray-100 pt-3">
                <p 
                    className="font-inter text-sm green_gradient cursor-pointer"
                    onClick={handleEdit}
                >
                    Edit
                </p>
                <p 
                    className="font-inter text-sm orange_gradient cursor-pointer"
                    onClick={handleDelete}
                >
                    Delete
                </p>
            </div>
        )}

    </div> 
  )
}

export default PromptCard
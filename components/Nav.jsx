"use client"

import Link from "next/link";
import Image from "next/image";
import logo from "../public/assets/images/logo.svg"
import {signIn, signOut, getProviders, useSession} from 'next-auth/react';
import { useEffect, useState } from "react";

const Nav = () => {
    const {data: session} = useSession();

    const [providers, setProviders] = useState(null);

    //we need to toggle with useState for mobile
    const [toggleDropdown, setToggleDropdown] = useState(false);

    useEffect(() => {
        const setUpProviders = async () => {
            const response = await getProviders();

            setProviders(response);
        }
        setUpProviders();
    }, [])
  return (
    <nav className="flex-between w-full mb-16 pt-3">
        {/* we create a clickable image  and page title */}
        <Link href="/" className="flex gap-2 flex-center">
            <Image 
                src={logo}               
                width={30}
                height={30}
                className="object-contain"
                alt="promptopia logo"
            />
            <p className="logo_text">Promptopia</p>
        </Link>

        {/* Desktop Navigation */}
        <div className="sm:flex hidden">
            {/* navigation bar changes for signed in users */}
            {session?.user ? (
                <div className="flex gap-3 md:gap-5">
                    <Link 
                        href="/create-prompt" className="black_btn"                        
                    >
                        Create Post
                    </Link>
                    <button type="button" onClick={signOut} className="outline_btn">
                        Sign Out
                    </button>

                    <Link href="/profile">
                        <Image
                            src={session?.user.image}
                            width={37}
                            height={37}
                            className="rounded-full"
                            alt="profile"
                        />
                    </Link>
                </div>
            ): (
                <>
                    {providers &&                    
                        Object.values(providers).map((provider) => (
                            <button 
                                className="black_btn"
                                type="button"
                                key={provider.name}
                                onClick={() => signIn(provider.id)}
                            >
                                Sign In
                            </button>
                        )
                    )}
                </>
            )}
        </div>
        {/*mobile Navigation */}
        <div className="sm:hidden flex relative">
            {/* navigation menu depends on user state */}
            {session?.user ? (
                <div className="flex">
                    <Image
                        src={session?.user.image}
                        width={37}
                        height={37}
                        className="rounded-full"
                        alt="profile"
                        //we do not change useState right away but we get prev state first
                        onClick={() => setToggleDropdown((prev) => !prev)}
                    />
                    {  toggleDropdown && (
                        // menu options for navigation as links
                        <div className="dropdown">
                            <Link 
                                href="/profile"
                                className="dropdown_link"
                                onClick={() => setToggleDropdown(false)}
                            >
                                My Profile
                            </Link>
                            <Link 
                                href="/create-prompt"
                                className="dropdown_link"
                                onClick={() => setToggleDropdown(false)}
                            >
                                Create Prompt
                            </Link>
                            <button 
                                type="button"
                                onClick={() => {
                                    signOut()
                                    setToggleDropdown(false)                                    
                                }}
                                className="mt-5 w-full black_btn"
                            >
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
                ): (
                    <>
                        {providers &&                    
                            Object.values(providers).map((provider) => (
                                <button 
                                    className="black_btn"
                                    type="button"
                                    key={provider.name}
                                    onClick={() => signIn(provider.id)}
                                >
                                    Sign In
                                </button>
                            )
                        )}
                    </>
                )}
        </div>

    </nav>
  )
}

export default Nav;
import NextAuth from "next-auth/next";
import GoogleProvider from 'next-auth/providers/google';
import { signIn } from "next-auth/react";
import { connectToDB } from "@utils/database";
import User from "@models/User";

const handler = NextAuth({
    providers: [
        //google provider setup
        GoogleProvider({
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
        })
    ],
    callbacks: {
        async session({session}) {
            //check which user is logged in
            const sessionUser = await User.findOne({
                email: session.user.email
            })
            session.user.id = sessionUser._id.toString();
            return session;
        },
        async signIn({profile}) {
            try {
                //severless -> lambda - function
                await connectToDB();
    
                //check if user already exists
                const userExists = await User.findOne({
                    email: profile.email
                })
    
                //if not create a new user
                if (!userExists) {
                    await User.create({
                        email: profile.email,
                        username: profile.name.replace(" ","").toLowerCase(),
                        image: profile.picture
                    })
                }
                return true;
            } catch (error) {
                
            }
        }
    }
})

export {handler as GET, handler as POST};
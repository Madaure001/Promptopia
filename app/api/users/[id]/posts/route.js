import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database"

export const GET = async (request, {params}) => {
    //get all user's prompt
    try {
        await connectToDB();
        //return all prompts by the user
        const prompts = await Prompt.find({
            creator: params.id
        }).populate('creator');

        return new Response(JSON.stringify(prompts), {status: 200});

    } catch (error) {
        return new Response("Failed to fetch all user's prompts", {status: 500});
        
    }
}
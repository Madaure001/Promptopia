import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

export const POST = async(request) => {
//we need to pass prompt using the user request {
    const {userId, prompt, tag} = await request.json();

    //connect to DB
    try {
        await connectToDB();//lamda function dies after its job. must be called everytime
        const newPrompt = new Prompt({
            creator: userId,
            prompt,
            tag
        })
        //save the newly created prompt
        await newPrompt.save();

        return new Response(JSON.stringify(newPrompt), {
            status:201
        })
    } catch (error) {
        return new Response("Failed to create a new Prompt", {status:500})
    }
}
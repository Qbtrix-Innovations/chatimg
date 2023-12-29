import type { Image } from "$lib/core/entities/Image";
import type { Message } from "$lib/core/entities/Message";
import { ConversationChain, SequentialChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { BufferMemory, ChatMessageHistory } from "langchain/memory";
import { PromptTemplate } from "langchain/prompts";
import { AIMessage, HumanMessage } from "langchain/schema";
import OpenAI from "openai";

export const getVisionAPIResponse = async (ImagesRef:Image[]):Promise<string>=>{
    const openai = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
    });
    const response = await openai.chat.completions.create({
        model: 'gpt-4-vision-preview',
        max_tokens: 1024,
        messages: [
            {
                role: 'user',
                content: [
                    {
                        type: 'text',
                        text: 'Give a detailed description of the given image. This description will be further passed on to another Large Language Model where it will be used for answering various questions that are asked by the user. Only reply with the descriptino for the image and nothing more as the description will also be shown to the user.'
                    },
                    {
                        type: 'image_url',
                        image_url: {
                            url: `${ImagesRef[0].imageUrl}`,
                            detail: 'high'
                        }
                    }
                ]
            }
        ]
    });
    if (response.choices[0].message.content) {
        return response.choices[0].message.content;
    } else {
        return `ERROR: Something went wrong. Please try again.`
    }
}

export const getVisionAPIResponseWithoutImage = async(message:string):Promise<string>=>{
    const openai = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
    });
    const response = await openai.chat.completions.create({
        model: 'gpt-4-vision-preview',
        max_tokens: 1024,
        messages: [
            {
                role: 'user',
                content: [
                    {
                        type: 'text',
                        text: 'Give a detailed description of the given image. This description will be further passed on to another Large Language Model where it will be used for answering various questions that are asked by the user. Only reply with the descriptino for the image and nothing more as the description will also be shown to the user.'
                    }
                ]
            }
        ]
    });
    if (response.choices[0].message.content) {
        return response.choices[0].message.content;
    } else {
        return `ERROR: Something went wrong. Please try again.`
    }   
}

export const getOpenAiReply=async (inpTxt:string,data:{
    uid:string,
    imagesDataArray:Image[],
    MessagesDataArray:Message[]
}):Promise<string>=>{
    const imageUrl = data.imagesDataArray[0].imageUrl;
    let pastMessages = [];
    for (let index = 0; index < data.MessagesDataArray.length; index++) {
        const element = data.MessagesDataArray[index];
        if (element.sentBy != 'GPT') {
            pastMessages.push(new HumanMessage(element.text));
        } else {
            pastMessages.push(new AIMessage(element.text));
        }
    }
    // const chat = new ChatOpenAI({
    //     openAIApiKey: import.meta.env.VITE_OPENAI_API_KEY,
    //     modelName: 'gpt-4-vision-preview',
    //     maxTokens: 300
    // });
    // const message = new HumanMessage({
    //     content: [
    //         {
    //             type: 'text',
    //             text: `${inpTxt}`
    //         },
    //         {
    //             type: 'image_url',
    //             image_url: {
    //                 url: `${imageUrl}`,
    //                 detail: 'high'
    //             }
    //         }
    //     ]
    // });
    // const response = await chat.call([message]);
    const memory = new BufferMemory({
        chatHistory: new ChatMessageHistory(pastMessages)
    });
    const model = new ChatOpenAI({
        openAIApiKey: import.meta.env.VITE_OPENAI_API_KEY,
        modelName: 'gpt-4',
        maxTokens:1024
    });
    const template = `You are being given 3 inputs.\n
            1st is description of the image which is the main point of this chat.\n
            Image Description : ${data.MessagesDataArray[0].text}\n
            2nd is message that user has sent now and wants a response to that.\n
            {userMessage}
            You also have access to users previous chats in the form of memory. 
            history:{history}
            Assume that response from gpt-4-vision-preview is not available to the user.
            Provide only the final response that can be shown to the user.
            `;
    const promptTemplate = new PromptTemplate({
        template,
        // inputVariables: ['input']
        inputVariables: ['userMessage', 'history']
    });
    const chain = new ConversationChain({
        llm: model,
        prompt: promptTemplate,
        memory: memory,
        outputKey: 'content'
    });
    const overallChain = new SequentialChain({
        chains: [chain],
        // inputVariables: ["input"],
        inputVariables: ['userMessage', 'history'],
        outputVariables: ['content'],
        verbose: true
        // memory: memory
        // returnAll: true
    });
    // const userMessageAndResponseFromVisionPreviewModel = `
    //         User Message : ${inpTxt}\n
    //         3rd is response to users latest message from the 'gpt-4-vision-preview' model.\n
    //         Response from gpt-4-vision-preview : ${response.content}\n
    //         `;
    const userMessage = `User Message : ${inpTxt}\n`;
    // console.log(userMessageAndResponseFromVisionPreviewModel);
    const res2 = await overallChain.call({
        userMessage: userMessage
    });
    return res2.content;
}

export const getOpenAiReplyWithoutImage = async (inpTxt:string,data:{
    uid:string,
    imagesDataArray:Image[],
    MessagesDataArray:Message[]
}):Promise<string>=>{
    let pastMessages = [];
		for (let index = 0; index < data.MessagesDataArray.length; index++) {
			const element = data.MessagesDataArray[index];
			if (element.sentBy != 'GPT') {
				pastMessages.push(new HumanMessage(element.text));
			} else {
				pastMessages.push(new AIMessage(element.text));
			}
		}
		const memory = new BufferMemory({
			chatHistory: new ChatMessageHistory(pastMessages)
		});
		const model = new ChatOpenAI({
			openAIApiKey: import.meta.env.VITE_OPENAI_API_KEY,
			modelName: 'gpt-4',
			maxTokens: 1024
		});
		const chain = new ConversationChain({
			llm: model,
			memory: memory,
			outputKey: 'content'
		});
		const response = await chain.call({ input: inpTxt });
		return response.content;
}
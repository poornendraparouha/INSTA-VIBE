// for chatting
import { Conversation } from "../models/conversation..model.js";
import { Message } from "../models/message.model.js";

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const {message} = req.body;

        let conversation = await Conversation.findOne({
            participants:{$all:[senderId, receiverId]}
        })
        // establish the conversation if not started
        if(!conversation){
            conversation = await Conversation.create({
                participants:[senderId, receiverId]
            })
        }
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        });
        if(newMessage)conversation.messages.push(newMessage._id);
        await Promise.all([conversation.save(), newMessage.save()])

        // implement socket io for realtime data Transfer


        return res.status(200).json({
            success:true,
            newMessage
        })

    } catch (error) {
        console.log(error)
    }
}

export const getMessages = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const conversation = await Conversation.findOne({
            participants:{$all:[senderId, receiverId]}
        })
        // .populate('messages'); this has to be done if required
        if(!conversation){
            return res.status(200).json({
            success:true,
            message:[]
        })
        }
        return res.status(200).json({
            success:true,
            message: conversation?.messages
        })
    } catch (error) {
        console.log(error);
    }
}
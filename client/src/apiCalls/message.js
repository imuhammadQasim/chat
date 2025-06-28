import { axiosInstance } from "../apiCalls"

export const createNewMessage = async(message)=> {
    try {
        const response = await axiosInstance.post('api/message/new-message' , message );
        if (response.data.success) {
            return response.data;
        } else {
            throw new Error(response.data.message || "Failed to fetch chats");
        } 
    } catch (error) {
        return error
    }
}

export const getAllMessages = async(chatId)=> {
    try {
        const response = await axiosInstance.get(`api/message/get-messages/${chatId}` );
        if (response.data.success) {
            return response.data;
        } else {
            throw new Error(response.data.message || "Failed to fetch chats");
        } 
    } catch (error) {
        return error
    }
}
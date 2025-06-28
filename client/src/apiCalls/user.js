import { axiosInstance } from "./index.js";

export const getLoggedUser = async () => {
    try {
        const response = await axiosInstance.get(`/api/user/get-logged-user`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user:", error);
        return {
            success: false,
            message: error.response?.data?.message || "Failed to fetch user",
        };
        
    }
}


export const getAllUser = async () => {
    try {
        const response = await axiosInstance.get(`/api/user/get-all-user`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user:", error);
        return {
            success: false,
            message: error.response?.data?.message || "Failed to fetch user",
        };
        
    }
}
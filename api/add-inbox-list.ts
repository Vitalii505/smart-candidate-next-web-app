import axios from "axios";

export const getAllInbox = async () => {
    try {
        const response = await axios.get("/list_apply_jobs/add-inbox-list")
        console.log(response?.data);
        return response?.data
    } catch(err) {
        console.error(err);
    }
};

export const setUrlToInbox = async (urlInput: string) => {
    try {
        const response = await axios.post("/list_apply_jobs/save-url", { url: urlInput });
        return response?.data
    } catch (err) {
        console.error(err);
    }
}

export const setGenerationAIAnswer = async (id: number, text: string) => {
    try {
        const response = await axios.post("/list_apply_jobs/generate_apply_text", { id: id, text: text });
        return response?.data
    } catch (err) {
        console.error(err);
    }
}

export const removeOnePostById = async (id: number) => {
    try {
        const response = await axios.post("/list_apply_jobs/remove-data-post", {id: id});
        return response?.data
    } catch (err) {
        console.error(err);
    }
}

import { API_BASE_URL } from "./config";
import axios from "axios";
import { ProgressDetail } from "@/components/chat/types";

export interface StartChatResponse {
    sessionId: string;
    message: string;
    formTitle?: string;
    totalFields?: number;
    estimatedMinutes?: number;
    state?: string;
    progressDetail?: ProgressDetail;
}

export interface ReplyChatResponse {
    message: string;
    isComplete: boolean;
    collectedData: Record<string, string>;
    state?: string;
    progressDetail?: ProgressDetail;
}

export async function startChat(url: string): Promise<StartChatResponse> {
    try {
        const response = await axios.post(`${API_BASE_URL}/ai/form/start`, { url }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = response.data;
        return {
            sessionId: data.sessionId,
            message: data.message,
            formTitle: data.formTitle,
            totalFields: data.totalFields,
            estimatedMinutes: data.estimatedMinutes,
            state: data.state,
            progressDetail: data.progressDetail,
        };
    } catch (error) {
        throw error;
    }
}

export async function replyChat(sessionId: string, message: string): Promise<ReplyChatResponse> {
    try {
        const response = await axios.post(`${API_BASE_URL}/ai/form/reply`, { sessionId, message }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = response.data;
        return {
            message: data.message,
            isComplete: data.isComplete,
            collectedData: data.collectedData,
            state: data.state,
            progressDetail: data.progressDetail,
        };
    } catch (error) {
        throw error;
    }
}

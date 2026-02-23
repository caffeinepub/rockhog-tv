import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface BaconCashRequest {
    id: string;
    user: Principal;
    completed: boolean;
    amount: bigint;
}
export interface AIMessage {
    isAI: boolean;
    text: string;
}
export interface ChatMessage {
    id: bigint;
    sender: Principal;
    message: string;
    timestamp: bigint;
    senderName: string;
}
export interface StreamerPayment {
    id: string;
    channelId: string;
    recipient: Principal;
    sender: Principal;
    message?: string;
    timestamp: bigint;
    amount: bigint;
}
export interface Channel {
    id: string;
    title: string;
    thumbnail: ExternalBlob;
    owner: Principal;
    description: string;
    chatRoomId?: string;
    category: Category;
    streamKey: string;
    streamUrl: string;
    ingestUrl: string;
}
export interface Conversation {
    id: string;
    messages: Array<AIMessage>;
    owner: Principal;
}
export interface UserProfile {
    baconCashBalance: bigint;
    name: string;
    bestScore: bigint;
}
export enum Category {
    djs = "djs",
    irl = "irl",
    music = "music",
    adult = "adult",
    gaming = "gaming",
    audio_video_podcasts = "audio_video_podcasts",
    sports = "sports",
    horror = "horror",
    ppv_events = "ppv_events",
    radio = "radio"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createChannel(id: string, title: string, category: string, description: string, thumbnail: ExternalBlob, streamUrl: string, ingestUrl: string, streamKey: string): Promise<string>;
    createChatRoom(name: string): Promise<string>;
    createDefaultChatRoom(): Promise<string>;
    deleteChannel(id: string): Promise<void>;
    fulfillBaconCashRequest(requestId: string): Promise<void>;
    getAllBaconCashRequests(): Promise<Array<BaconCashRequest>>;
    getAllChannels(): Promise<Array<Channel>>;
    getAllChatRooms(): Promise<Array<[string, string]>>;
    getBalance(): Promise<bigint>;
    getBestScore(): Promise<bigint>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getChannel(id: string): Promise<Channel | null>;
    getChatRoomMessages(roomId: string): Promise<Array<ChatMessage>>;
    getConversation(conversationId: string): Promise<Conversation | null>;
    getConversations(): Promise<Array<Conversation>>;
    getMyBaconCashRequests(): Promise<Array<BaconCashRequest>>;
    getMyChannels(): Promise<Array<Channel>>;
    getPaymentsReceived(user: Principal): Promise<Array<StreamerPayment>>;
    getPaymentsSent(user: Principal): Promise<Array<StreamerPayment>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    postMessage(roomId: string, senderName: string, message: string): Promise<void>;
    requestBaconCash(amount: bigint): Promise<string>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendTip(sender: Principal, recipient: Principal, channelId: string, amount: bigint, message: string | null): Promise<string>;
    storeConversation(conversationId: string, conversation: Conversation): Promise<void>;
    updateBestScore(score: bigint): Promise<void>;
    updateChannel(id: string, title: string, category: string, description: string, thumbnail: ExternalBlob, streamUrl: string, ingestUrl: string, streamKey: string): Promise<void>;
}

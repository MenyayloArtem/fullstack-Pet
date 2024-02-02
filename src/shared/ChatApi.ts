import Api, {ApiRoutes} from "./Api";
import {IChannel} from "./Channel";
import IMessage, {RawMessage} from "./Message";
import {IUser} from "./User";

interface MessageRes {
    id: number;
    sender: {
        username: string;
        id: number;
        email: string;
        userIdentifier: string;
        roles: string[];
        password: string;
    };
    content: string;
    reply_message: any;
}

export interface IChat {
    id : number,
    members : IUser[],
    channels : IChannel[],
    icon : string,
    messages : IMessage[],
    title : string,
    description : string
}

export interface RawChat {
    title : string,
    description : string
}

export async function fetchFriends () : Promise<IUser[]> {
    let data = fetch("https://jsonplaceholder.typicode.com/users?limit=10")
    return (await data).json()
} 

export async function fetchChannels () : Promise<IChannel[]> {
    let json = await Api.get<any[]>("https://jsonplaceholder.typicode.com/todos?limit=5")
    let channels = json.map((channel : any) => ({name : channel.title.slice(0,20) as string})).slice(0,4)
    console.log(channels)
    return channels
} 


export default class ChatApi {
    public static async fetchChannels () {
        let json = await Api.get<any[]>("https://jsonplaceholder.typicode.com/todos?limit=5")
        let channels = json.map((channel : any) => ({name : channel.title.slice(0,20) as string})).slice(0,4)
        console.log(channels)
        return channels
    }

    public static async getChats () {
        return await Api.get<IChat[]>(Api.makeUrl(ApiRoutes.GetChats))
    }

    // Chats

    public static async createChat (chat : RawChat, mediaId: number) {
        return await Api.post(Api.makeUrl(ApiRoutes.Chats), {
            payload : {
                chat : {
                    title : chat.title,
                    description : chat.description,
                    media_id : mediaId
                }
            }
        })
    }

    public static async editChat (chat : RawChat, chatId : number) {
        return await Api.post(Api.makeUrl(ApiRoutes.Chats), {
            payload : {
                chat_id : chatId,
                chat : {
                    ...chat
                }
            }
        })
    }

    // Members

    public static async addMember (chatId : number, memberId : number) {
        return await Api.post<IChat[]>(Api.makeUrl(ApiRoutes.Members), {
            payload : {
                chat_id : chatId,
                member_id : memberId
            }
            
        })
    }

    public static async deleteMember (chat_id : number, member_id : number) {
        return await Api.delete<IChat[]>(Api.makeUrl(ApiRoutes.Members), {
            payload : {
                chat_id : chat_id,
                member_id : member_id
            }
            
        })
    }

    public static async getMembers (chatId : number) {
        return await Api.get<IUser[]>(Api.makeUrl(ApiRoutes.Members), {
            query : {
                chatId : chatId
            }
        })
    }

    public async checkMembership (chatId : number) {
        return await Api.get(Api.makeUrl(ApiRoutes.Membership), {
            template : {
                chatId : chatId
            }
        })
    }

    // Messages

    public static async getMessages (chatId : number, page = 1)  {
        return await Api.post<IMessage[]>(Api.makeUrl(ApiRoutes.MessagesGet), {
            payload : {
                chat_id : chatId,
                page
            }
        })
    }

    public static async sendMessage (chatId : number,message : RawMessage): Promise<MessageRes> {
        return await Api.post(Api.makeUrl(ApiRoutes.Message), {
            payload : {
                chat_id : chatId,
                message
            }
        })
    }

    public static async editMessage (chatId : number,message : RawMessage, messageId : number) {
        return await Api.patch(Api.makeUrl(ApiRoutes.Message), {
            payload : {
                message_id : messageId,
                message
            }
        })
    }
    
}

class Members {

}
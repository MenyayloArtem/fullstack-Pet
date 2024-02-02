import Api, { ApiRoutes } from "./Api";
import IMessage from "./Message";
import { Section } from "./Section";

export interface ITopic {
    id: number | null;
    title: string;
    section: Section;
    topicMessages: IMessage[];
    cliped: boolean;
    date_created: Date;
}

export default class Topics {
    public static async createTopic (topic : ITopic) {
        return await Api.post(Api.makeUrl(ApiRoutes.Topic), {
            payload : {
                topic
            }
        })
    }

    public static async sendMessage (topicId : number, message: IMessage, media_ids : number[]) {
        return await Api.post(Api.makeUrl(ApiRoutes.TopicMessage), {
            template : {
                topicId
            },
            payload : {
                message,
                media_ids
            }
        })
    }

    public static async editMessage (topicId : number, messageId: number,message: IMessage) {
        return await Api.patch(Api.makeUrl(ApiRoutes.TopicMessage), {
            template : {
                topicId
            },
            payload : {
                message_id : messageId,
                message
            }
        })
    }

    public static async addSection (title : string) {
        return await Api.post(Api.makeUrl(ApiRoutes.Section), {
            payload : {
                section : {
                    title
                }
            }
        })
    }
}
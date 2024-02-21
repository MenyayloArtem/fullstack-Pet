import { IUser } from "./User";

export interface Media {
    id : number,
    description : string,
    props : any,
    type : string,
    public : boolean,
    sender : IUser,
}
export default interface IMessage {
    id: number;
    content: string | null;
    dateCreated: Date | null;
    sender: IUser;
    medias: Media[];
    reply_message? : IMessage
}

export interface RawMessage {
    text : string,
    media_ids : number[]
}
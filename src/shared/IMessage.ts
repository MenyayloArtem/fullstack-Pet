import {IUser} from "./User";

export default interface IMessage {
    user : IUser,
    createdAt : string,
    text : string
}


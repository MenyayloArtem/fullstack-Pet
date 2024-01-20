import { IUser } from "./User";

export interface Message {
    id: number | null;
    content: string | null;
    date_created: Date | null;
    sender: IUser | null;
    medias: any[] | null;
}
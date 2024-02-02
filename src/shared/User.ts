import Api, { ApiRoutes } from "./Api"

export interface IUser {
    id : number,
    email : string,
    avatar? : string,
    name : string,
    username : string,
    description? : string,
    isOnline? : boolean
}

interface UserCanEdit {
    username : string
}

export default class User {

    public static currentUser : IUser|null

    public static async getUser (id : number) {
        if (!id) {
            if (this.currentUser) {
                id = this.currentUser.id
            }
        }
        return await Api.get<IUser[]>(Api.makeUrl(ApiRoutes.GetUser,{userId : id}))
    }

    public static async editUser (user : UserCanEdit) {
            // if (this.currentUser) {
                let id = this.currentUser?.id
            // }
        return await Api.patch<IUser[]>(Api.makeUrl(ApiRoutes.GetUser,{userId : id}), {
            payload : user
        })
    }

}
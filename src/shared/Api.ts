import { IUser } from "./User"

export interface Credentials {
    password : string,
    username : string
}

interface AdditionOptions {
    payload? : any,
    query? : any,
    template? : any
}

interface RequestOptions<T = any> extends AdditionOptions {
    method : Methods,
    url : string,
}

export default class Api {

    public static hostUrl = "http://localhost:3001/"
    public static apiUrl = this.hostUrl + "api/"

    public static makeUrl (route : ApiRoutes|string, template? : any, prefix = Api.apiUrl) {
        if (template) {
            for (let key in template) {
                route = route.replace(":" + key, template[key])
            }
        }
        return prefix + route
    }

    private static async makeRequest<T = any> (requestOptions : RequestOptions) : Promise<T> {

        try {
            const options : RequestInit = {
                credentials : "include",
                method : requestOptions.method,
                body : undefined,
                headers : {
                    "Content-Type" : "application/json"
                }
            }

            if (requestOptions.template) {
                requestOptions.url = Api.makeUrl(requestOptions.url, requestOptions.payload, "")
            }

            if (requestOptions.query) {
                if (requestOptions.method == Methods.GET) {
                    let queryData = Object.entries(requestOptions.query).map(i => i.join("="))
                    requestOptions.url += "?" + queryData
                }
            }

            if (requestOptions.payload) {
                    options.body = JSON.stringify(requestOptions.payload)
            }

            console.log(requestOptions)
            let data = await fetch(requestOptions.url, options)
            return await data.json()
        } catch (e) {
            console.log((e as any).message)
            return "" as any
        }

    }

    static async get<T = any> (url : string, options? : AdditionOptions) : Promise<T> {
        const data = await Api.makeRequest<T>({
            method : Methods.GET, url, ...options
        })

        return data
    }

    static async post<T> (url : string, options : AdditionOptions) : Promise<T> {
        const data = await Api.makeRequest<T>({
            method : Methods.POST, url, ...options
        })

        return data
    }

    static async patch<T> (url : string, options : AdditionOptions) : Promise<T> {
        const data = await Api.makeRequest<T>({
            method : Methods.PATCH, url, ...options
        })

        return data
    }

    static async delete<T> (url : string, options : AdditionOptions) : Promise<T> {
        const data = await Api.makeRequest<T>({
            method : Methods.DELETE, url, ...options
        })

        return data
    }

    static async login (credentials : Credentials) {
        return Api.post<IUser>(Api.hostUrl + ApiRoutes.Login, {
            payload : credentials
        })
    }
}

export enum Methods {
    GET = "GET",
    POST = "POST",
    PATCH = "PATCH",
    DELETE = "DELETE"
}

export enum ApiRoutes {
    Login = "login",
    GetChats = "user/chats",
    GetUser = "user/:userId",
    User = "user",
    Chats = "chat",
    Members = "chatMembers",
    Membership = "checkMembership",
    Message = "messages",
    Topic = "topic",
    TopicMessage = "topic/:topicId/message",
    Section = "secton"
}
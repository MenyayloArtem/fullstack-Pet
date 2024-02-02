import { IUser } from "./User"
import Socket from "./Socket"

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
    public static uploadUrl = this.hostUrl + "upload"
    public static mediasUrl = this.hostUrl + "media"
    public static socketUrl = "ws://localhost:3002"

    public static currentUser : IUser|null = null
    public static SocketConnection : WebSocket|null = null

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
                if (requestOptions.payload instanceof FormData) {
                    options.body = (requestOptions.payload)
                    options.headers = undefined
                } else {
                    options.body = JSON.stringify(requestOptions.payload)
                }

            }

            let res = await fetch(requestOptions.url, options)
            if (res.status === 401) {
                return Api.login()
                    .then(async () => {
                        return await fetch(requestOptions.url, options)

                    })
                    .then(async (res) => {
                        return await res.json()
                    })

            }
            return await res.json()
        } catch (e : any) {
            throw new Error(e.message as any)
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

    static async login () {
        let credentials = {
                "username" : "menyayloartem",
                "password" : "1234"
        }

        return Api.post<IUser>(Api.hostUrl + ApiRoutes.Login, {
            payload : credentials
        }).then((user : any) => {
            if (!Api.currentUser) {
                Api.currentUser = user.user
            }
            return user
        })
    }

    static async upload (file : File) {
        const formData = new FormData()
        formData.append("file", file)
        // let res = await fetch('http://localhost:3001/upload', {
        //     method: 'POST',
        //     body: formData,
        //     credentials : "include"
        // })
        // return await res.json()
        return Api.post(this.uploadUrl, {
            payload : formData
        }).then(res => {
            formData.delete("file")
            return res
        })
    }

    static async getCurrentUser () {
        return Api.get(Api.makeUrl(ApiRoutes.User))
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
    MessagesGet = "messagesGet",
    Topic = "topic",
    TopicMessage = "topic/:topicId/message",
    Section = "secton"
}
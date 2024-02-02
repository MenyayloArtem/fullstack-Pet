import Api from "./Api";
import message from "../components/Message/Message";

export default class Socket {

    private connection : WebSocket
    constructor() {
        this.connection = Api.SocketConnection || new WebSocket(Api.socketUrl);

        if (!Api.SocketConnection) {
            Api.SocketConnection = this.connection
        }
    }

    public onOpen (cb : (socket : Socket) => void) {
        this.connection.onopen = () => cb(new Socket())
    }

    public onMessage (cb : (message? : MessageEvent) => void) {
        this.connection.onmessage = (msg) => cb(msg)
    }

    public sendMessage (message : any) {
        let data = message
        if (data instanceof Object) {
            data = JSON.stringify(data)
        }
        this.connection.send(data)
    }
}
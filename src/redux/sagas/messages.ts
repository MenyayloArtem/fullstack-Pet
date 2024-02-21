import IMessage, {RawMessage} from "../../shared/Message";
import Api from "../../shared/Api";
import {call, put, spawn, takeEvery, select} from "redux-saga/effects";
import {ChatPageActions, ChatPageSelector, EDIT_MESSAGE, SEND_MESSAGE} from "../slices/ChatPageSlice";
import Chat from "../../shared/ChatApi";
import {PayloadAction} from "@reduxjs/toolkit";
import Socket, {SocketMessageTypes} from "../../shared/Socket";
import ChatApi from "../../shared/ChatApi";

let socket = new Socket()

function* sendMessage (chatId : number, rawMessage : RawMessage): IterableIterator<any> {
    // @ts-ignore
    let message : IMessage = {
        sender : Api.currentUser as any,
        content : rawMessage.text,
        medias : [],
        id : Math.random(),
        dateCreated : new Date(Date.now()),
    }

    console.log(chatId, rawMessage)

    try {
        let c = yield select(ChatPageSelector)
        console.log("chat")
        console.log(c)
        yield put(ChatPageActions.addMessage(message))
        yield put(ChatPageActions.pushMessageQueue(message))
        yield put(ChatPageActions.clearUploadedMedias())
        yield put(ChatPageActions.removeReplyMessage())
        yield put(ChatPageActions.clearSelectedMessages())
        const newMessage : any = yield call(Chat.sendMessage, chatId, rawMessage);

        console.log(newMessage)
        yield put(ChatPageActions.shiftMessageQueue())
        yield put(ChatPageActions.replaceMessage({
            message : newMessage,
            id : message.id
        }))
        socket.sendMessage({
            chatId,
            type : SocketMessageTypes.NewMessage,
            message : newMessage
        })
    } catch (e) {
        console.log(e)
        yield put(ChatPageActions.deleteMessageFromQueue(message))
    } finally {

    }
}

function* editMessage (chatId : number, oldMessage : IMessage,rawMessage : RawMessage) {
    try {
        yield put(ChatPageActions.clearSelectedMessages())
        yield put(ChatPageActions.removeEditMessage())
        yield put(ChatPageActions.clearUploadedMedias())
        yield put(ChatPageActions.clearSelectedMessages())
        // @ts-ignore
        let msg = yield call(ChatApi.editMessage, chatId,rawMessage, oldMessage.id)
        yield put(ChatPageActions.replaceMessage({
            message : msg,
            id : oldMessage.id
        }))

        socket.sendMessage({
            chatId,
            type : SocketMessageTypes.EditMessage,
            message : msg
        })
    } catch (e) {

    }

}
function* handleSendMessage ({payload} : PayloadAction<any>) {
    try {
        yield spawn(sendMessage, payload.chatId, payload.message)
    } catch (e) {
        console.log(e)
    }
}

function* handleEditMessage ({payload} : PayloadAction<any>) {
    try {
        yield spawn(editMessage, payload.chatId, payload.oldMessage, payload.rawMessage)
    } catch (e) {
        console.log(e)
    }
}
export default function* messagesSaga() {
    yield takeEvery(SEND_MESSAGE, handleSendMessage)
    yield takeEvery(EDIT_MESSAGE, handleEditMessage)
}
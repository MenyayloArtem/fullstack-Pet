import {call, put, spawn, fork ,takeEvery, takeLatest, delay} from "redux-saga/effects"
import {ChatMenuActions} from "../slices/ChatMenuSlice"
import Chat from "../../shared/ChatApi"
import {ChatPageActions, DELETE_MEMBER, FETCH_CHAT_DATA, SEND_MESSAGE} from "../slices/ChatPageSlice"
import {PayloadAction} from "@reduxjs/toolkit";
import IMessage, {RawMessage} from "../../shared/Message";
import Api from "../../shared/Api";
import Socket from "../../shared/Socket";


interface ChatAndMemberId {
    chat_id : number,
    member_id : number
}

let socket = new Socket()

function* getChats () : IterableIterator<any> {
    try {
        const chats : any = yield call(Chat.getChats)
        yield put(ChatMenuActions.setChats(chats.message))
    } catch (e) {
        // yield call(Api.login)
        throw new Error()
    }

}

function* getMembers (chatId : number): IterableIterator<any> {
    const members : any = yield call(Chat.getMembers, chatId);
    yield put(ChatPageActions.setSelectedChatMembers(members.members))
}

function* getMessages (chatId : number): IterableIterator<any> {
    // @ts-ignore
    const messages : IMessage[] = yield call(Chat.getMessages, chatId);
    yield put(ChatPageActions.setMessages(messages))
}

function* sendMessage (chatId : number, rawMessage : RawMessage): IterableIterator<any> {
    // @ts-ignore
    let message : IMessage = {
        sender : Api.currentUser as any,
        content : rawMessage.text,
        medias : [],
        id : Math.random(),
        dateCreated : new Date(Date.now()),
    }

    try {
        yield put(ChatPageActions.addMessage(message))
        yield put(ChatPageActions.pushMessageQueue(message))
        const newMessage : any = yield call(Chat.sendMessage, chatId, rawMessage);
        console.log(newMessage)
        yield put(ChatPageActions.shiftMessageQueue())
        yield put(ChatPageActions.replaceMessage({
            message : newMessage,
            id : message.id
        }))
        socket.sendMessage({
            chatId,
            message : newMessage
        })
    } catch (e) {
        console.log("error")
        yield put(ChatPageActions.deleteMessageFromQueue(message))
    } finally {
        yield put(ChatPageActions.clearUploadedMedias())
    }




}

function* deleteMember (chat_id: number, member_id : number) : IterableIterator<any> {
    let res = yield call(Chat.deleteMember,chat_id,member_id)
    console.log(res)
}

function* fetchUserWorker (action : PayloadAction<any>)  {
    try {
        yield spawn(getChats)

    } catch (error) {
        console.log(error)
    }
}

function* fetchChatData (action : PayloadAction<any>) {
    try {
        yield spawn(getMembers,action.payload)
        yield spawn(getMessages, action.payload)
    } catch (e) {

    }
}

function* handleMessage ({payload} : PayloadAction<any>) {
    try {
        yield spawn(sendMessage, payload.chatId, payload.message)
    } catch (e) {
        console.log(e)
    }
}

function* handleDeleteMember ({payload} : PayloadAction<ChatAndMemberId>) {
    try {
        yield spawn(deleteMember,payload.chat_id, payload.member_id)
    } catch (e) {

    }
}


function* fetchUsersSaga() {
    yield takeEvery(ChatPageActions.fetchData().type, fetchUserWorker)
    yield takeEvery(SEND_MESSAGE, handleMessage)
    yield takeLatest(FETCH_CHAT_DATA, fetchChatData)
    yield takeEvery(DELETE_MEMBER, handleDeleteMember)
}

export default fetchUsersSaga
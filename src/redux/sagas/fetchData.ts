import {call, put, spawn, fork ,takeEvery, takeLatest, delay} from "redux-saga/effects"
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

function* getChats () : IterableIterator<any> {
    try {
        const chats : any = yield call(Chat.getChats)
        yield put(ChatPageActions.setChats(chats.message))
    } catch (e) {
        throw new Error()
    }
}

function* getMembers (chatId : number): IterableIterator<any> {
    const members : any = yield call(Chat.getMembers, chatId);
    yield put(ChatPageActions.setSelectedChatMembers(members.members))
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
        // yield spawn(getMessages, action.payload)
    } catch (e) {

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

    yield takeLatest(FETCH_CHAT_DATA, fetchChatData)
    yield takeEvery(DELETE_MEMBER, handleDeleteMember)
}

export default fetchUsersSaga
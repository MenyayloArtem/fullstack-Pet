import {call, spawn, takeEvery, put, select} from "redux-saga/effects";
import {Media} from "../../shared/Message";
import {PayloadAction} from "@reduxjs/toolkit";
import ChatApi, {IChat} from "../../shared/ChatApi";
import {ChatPageActions} from "../slices/ChatPageSlice";
import {ModalActions} from "../../modals/store/ModalSlice";
function* editChat (title : string, description : string,chatId : number, media? : Media) {
    // @ts-ignore
    let chat : any = yield call(ChatApi.editChat, {title, description, media_id : media?.id}, chatId)
    console.log(chat)
    yield put(ChatPageActions.updateChat(chat))
    yield put(ChatPageActions.updateSelectedChat(chat))
}

function* leaveChat (id : number) {
    console.log(id)
    yield call(ChatApi.leaveChat, id)
    // @ts-ignore
    const {chats} = yield select(ChatMenuSelector)
    console.log(chats)
    yield put(ChatPageActions.removeChat(id))
    yield put(ModalActions.closeModal())
    yield put(ChatPageActions.setSelectedChat(chats.at(-1)!))
}
function *handleEditMessage ({payload} : PayloadAction<any>) {
    try {
        yield spawn(editChat, payload.title, payload.description, payload.chatId, payload.media)
    } catch (e) {

    }
}

function* handleLeaveChat ({payload} : PayloadAction<any>) {
    try {
        console.log(payload)
        yield spawn(leaveChat, payload.chat.id)
    } catch (e) {

    }
}
export default function* chatsSaga() {
    yield takeEvery(EDIT_CHAT, handleEditMessage)
    yield takeEvery(LEAVE_CHAT, handleLeaveChat)
}

const EDIT_CHAT = "EDIT_CHAT"
const LEAVE_CHAT = "LEAVE_CHAT"
export const editChatAction = (title : string, description : string,chatId : number, media? : Media) => {
    return {
        type : EDIT_CHAT,
        payload : {
            title,description,
            media : media || undefined,
            chatId
        }
    }
}
export const leaveChatAction = (chat : IChat) => {
    console.log(chat)
    return {
        type : LEAVE_CHAT,
        payload : {
            chat
        }
    }
}
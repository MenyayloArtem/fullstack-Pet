import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from ".."
import {IUser} from "../../shared/User"
import { IChannel } from "../../shared/Channel"
import {IChat, RawChat} from "../../shared/ChatApi"
import makeAction from "../../helpers/makeAction";
import IMessage from "../../shared/Message";
import Api from "../../shared/Api";

interface InitialState {
    selectedChat : IChat|null,
    selectedChannel : IChannel|null,
    selectedUser : IUser|null,
    messagesQueue : IMessage[],
    errorMessages : IMessage[],
    uploadedImages : number[]
}

const initialState : InitialState = {
    selectedChat : null,
    selectedChannel : null,
    selectedUser : null,
    messagesQueue : [],
    errorMessages : [],
    uploadedImages : []
}

const ChatPageSlice = createSlice({
    name : "ChatPage",
    initialState,
    reducers : {

        fetchData () {},

        setMessages (state, {payload}) {
            if (state.selectedChat) {
                state.selectedChat.messages = payload
            }
        },

        addUploadedMedias (state, {payload}: PayloadAction<number>) {
            state.uploadedImages = [...state.uploadedImages,payload]
        },

        removeUploadedMedia (state, {payload} : PayloadAction<number>) {
            state.uploadedImages = state.uploadedImages.filter(m => m !== payload)
        },

        clearUploadedMedias (state) {
            state.uploadedImages = []
        },

        addMessage (state, {payload} : PayloadAction<IMessage>) {
            if (state.selectedChat && Api.currentUser) {
                state.selectedChat.messages.push(payload)
            }
        },

        pushMessageQueue (state, {payload} : PayloadAction<IMessage>) {
            state.messagesQueue.push(payload)
        },

        shiftMessageQueue (state) {
            state.messagesQueue.shift()
        },

        replaceMessage (state, {payload}: PayloadAction<{
            message : IMessage, id : number
        }>) {
            if (state.selectedChat) {
                const index = state.selectedChat.messages.findIndex(m => m.id === payload.id)
                console.log(index)
                if (index > -1) {
                    state.selectedChat.messages[index] = payload.message
                }
            }

        },

        deleteMessageFromQueue (state, action : PayloadAction<IMessage>) {
            let index = state.messagesQueue.findIndex(m => m.id === action.payload.id)
            state.errorMessages.push(state.messagesQueue[index])
            state.messagesQueue.splice(index,1)
        },

        setSelectedChat (state, {payload} : PayloadAction<IChat>) {
            state.selectedChat = payload
        },

        setSelectedChatMembers (state, {payload} : PayloadAction<any[]>) {
            if (state.selectedChat) {
                state.selectedChat.members = payload
            }
        },

        setSelectedChannel (state, {payload} : PayloadAction<IChannel>) {
            state.selectedChannel = payload
        },

        setSelectedUser (state, {payload} : PayloadAction<IUser>) {
            state.selectedUser = payload
        },
    }
})

export const FETCH_CHAT_DATA = "fetchChatData"
export const SEND_MESSAGE = "sendMessage"

export const DELETE_MEMBER = "deleteMember"

export const ChatPageReducer = ChatPageSlice.reducer
export const ChatPageActions = ChatPageSlice.actions
export const ChatPageSelector = (state : RootState) => state.ChatPage
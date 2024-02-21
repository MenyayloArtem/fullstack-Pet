import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from ".."
import {IUser} from "../../shared/User"
import { IChannel } from "../../shared/Channel"
import {IChat, RawChat} from "../../shared/ChatApi"
import makeAction from "../../helpers/makeAction";
import IMessage, {Media} from "../../shared/Message";
import Api from "../../shared/Api";

interface InitialState {
    selectedChat : IChat|null,
    selectedChannel : IChannel|null,
    selectedUser : IUser|null,
    messagesQueue : IMessage[],
    errorMessages : IMessage[],
    uploadedImages : Media[],
    selectedMessages : IMessage[],
    reply_message : IMessage|null,
    searchedMessages : IMessage[],
    editMessage : IMessage|null,
    newMessages : number,
    chats : IChat[]
}

const initialState : InitialState = {
    selectedChat : null,
    selectedChannel : null,
    selectedUser : null,
    messagesQueue : [],
    errorMessages : [],
    uploadedImages : [],
    reply_message : null,
    newMessages : 0,
    searchedMessages : [],
    selectedMessages : [],
    editMessage : null,
    chats : []
}

const ChatPageSlice = createSlice({
    name : "ChatPage",
    initialState,
    reducers : {
        clear (state) {
            state.selectedChat = null
            state.selectedChannel = null
            state.selectedUser = null
            state.messagesQueue = []
            state.errorMessages =[]
            state.uploadedImages = []
            state.reply_message = null
            state.newMessages = 0
            state.searchedMessages = []
            state.selectedMessages = []
            state.editMessage = null
            state.chats = []
        },

        fetchData () {},

        setChats (state, {payload} : PayloadAction<any[]>) {
            state.chats = payload
        },
        addChat (state, {payload} : PayloadAction<IChat>) {
            state.chats.push(payload)
        },
        updateChat (state, {payload} : PayloadAction<IChat>) {
            const chat = state.chats.find(c => c.id === payload.id)

            if (chat) {
                chat.title = payload.title
                chat.description = payload.description
                chat.icon = payload.icon
            }
        },

        removeChat (state, {payload} : PayloadAction<number>) {
            state.chats = state.chats.filter(c => c.id !== payload)
        },

        addMember (state, {payload} : PayloadAction<IUser>) {
            if (state.selectedChat) {
                state.selectedChat.members.push(payload)
                state.selectedChat.membersCount++
            }
        },

        deleteMember (state, {payload} : PayloadAction<IUser>) {
            if (state.selectedChat) {
                state.selectedChat.members = state.selectedChat.members.filter(m => m.id !== payload.id)
                state.selectedChat.membersCount--
            }
        },

        setNewMessages (state, {payload} : PayloadAction<number>) {
            state.newMessages = payload
        },

        addNewMessages (state) {
            state.newMessages = state.newMessages + 1
        },

        setEditMessage (state, {payload} : PayloadAction<IMessage>) {
            state.editMessage = payload
        },

        removeEditMessage (state) {
            state.editMessage = null
        },

        pushSelectedMessage (state, {payload} : PayloadAction<IMessage>) {
            if (!state.selectedMessages.some(m => m.id === payload.id)) {
                state.selectedMessages.push(payload)
            }
        },

        clearSelectedMessages (state) {
            state.selectedMessages = []
        },

        removeSelectedMessage (state, {payload} : PayloadAction<IMessage>) {
            state.selectedMessages = state.selectedMessages.filter(m => m.id !== payload.id)
        },

        setMessages (state, {payload}) {
            if (state.selectedChat) {
                state.selectedChat.messages = payload
            }
        },

        setUploadedMedias (state, {payload}: PayloadAction<Media[]>) {
            state.uploadedImages = payload
        },

        addUploadedMedias (state, {payload}: PayloadAction<Media>) {
            state.uploadedImages = [...state.uploadedImages,payload]
        },

        setReplyMessage (state, {payload}: PayloadAction<number>) {
            const reply_message = state.selectedChat!.messages.find(m => m.id === payload)

            if (reply_message) {
                state.reply_message = reply_message
            }
        },

        setSearchedMessages (state, {payload}: PayloadAction<IMessage[]>) {
            state.searchedMessages = payload
        },

        clearSearchedMessages (state) {
          state.searchedMessages = []
        },

        removeReplyMessage (state) {
            state.reply_message = null
        },

        removeUploadedMedia (state, {payload} : PayloadAction<Media>) {
            state.uploadedImages = state.uploadedImages.filter(m => m.id !== payload.id)
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

        updateSelectedChat (state, {payload} : PayloadAction<IChat>) {
            if (state.selectedChat) {
                state.selectedChat.title = payload.title
                state.selectedChat.description = payload.description
                state.selectedChat.icon = payload.icon
            }
        },

        setSelectedChat (state, {payload} : PayloadAction<IChat|null>) {
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
export const sendMessageAction = (chatId : number, text : string, medias : Media[], reply_id? : number) : PayloadAction<any> => {
    return {
        type : SEND_MESSAGE,
        payload : {
            chatId,
            message : {
                text : text,
                media_ids : medias.map(m => m.id),
                reply_id
            }
        }
    }
}
export const EDIT_MESSAGE = "editMessage"
export const editMessageAction = (chatId : number, text : string, medias : Media[], oldMessage : IMessage) : PayloadAction<any> => {
    return {
        type : EDIT_MESSAGE,
        payload : {
            chatId,
            rawMessage : {
                text : text,
                media_ids : medias.map(m => m.id)
            },
            oldMessage
        }
    }
}

export const DELETE_MEMBER = "deleteMember"

export const ChatPageReducer = ChatPageSlice.reducer
export const ChatPageActions = ChatPageSlice.actions
export const ChatPageSelector = (state : RootState) => state.ChatPage
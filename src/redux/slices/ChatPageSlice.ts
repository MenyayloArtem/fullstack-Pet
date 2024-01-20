import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from ".."
import {IUser} from "../../shared/User"
import { IChannel } from "../../shared/Channel"
import { IChat } from "../../shared/ChatApi"

interface InitialState {
    selectedChat : IChat|null,
    selectedChannel : IChannel|null,
    selectedUser : IUser|null
}

const initialState : InitialState = {
    selectedChat : null,
    selectedChannel : null,
    selectedUser : null
}

const ChatPageSlice = createSlice({
    name : "ChatPage",
    initialState,
    reducers : {

        fetchData () {},

        addMessage (state, {payload} : PayloadAction<string>) {
            if (state.selectedChat) {
                let user : IUser = {
                    name : "test",
                    username : "test",
                    id : 0
                }
                state.selectedChat.messages.push({
                    user,
                    createdAt : String(Date.now()),
                    text : payload
                })
            }
        },

        setSelectedChat (state, {payload} : PayloadAction<IChat>) {
            state.selectedChat = payload
        },

        setSelectedChannel (state, {payload} : PayloadAction<IChannel>) {
            state.selectedChannel = payload
        },

        setSelectedUser (state, {payload} : PayloadAction<IUser>) {
            state.selectedUser = payload
        },
    }
})

export const ChatPageReducer = ChatPageSlice.reducer
export const ChatPageActions = ChatPageSlice.actions
export const ChatPageSelector = (state : RootState) => state.ChatPage
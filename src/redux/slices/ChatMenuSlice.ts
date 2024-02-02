import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from ".."
import {IUser} from "../../shared/User"
import { IChannel } from "../../shared/Channel"
import { IChat } from "../../shared/ChatApi"

interface InitialState {
    chats : any[],
    channels : IChannel[],
    friends : IUser[],
    selectedChat : IChat|null,
    selectedChannel : IChannel|null
}

const initialState : InitialState = {
    chats : [],
    channels : [],
    friends : [],
    selectedChat : null,
    selectedChannel : null
}

const ChatMenuSlice = createSlice({
    name : "ChatMenu",
    initialState,
    reducers : {

        setFriends (state, {payload} : PayloadAction<IUser[]>) {
            state.friends = payload
        },

        setChats (state, {payload} : PayloadAction<any[]>) {
            state.chats = payload
        },

        setChannels (state, {payload} : PayloadAction<IChannel[]>) {
            state.channels = payload
        },

        selectChat (state, {payload} : PayloadAction<IChat>) {
            state.selectedChat = payload
        },

        selectChannel (state, {payload} : PayloadAction<IChannel>) {
            state.selectedChannel = payload
        }

    }
})

export const ChatMenuReducer = ChatMenuSlice.reducer
export const ChatMenuActions = ChatMenuSlice.actions
export const ChatMenuSelector = (state : RootState) => state.ChatMenu
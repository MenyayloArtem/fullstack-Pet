import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IChat } from "../../shared/ChatApi";
import IMessage from "../../shared/Message";
import { RootState } from "..";
import { IUser } from "../../shared/User";

interface InitialState {
    chat : IChat|null,
    chatRef : HTMLElement|null
}

const initialState : InitialState = {
    chat : null,
    chatRef : null
}

const Chat = createSlice({
    initialState,
    name : "Chat",

    reducers : {
        setChat (state, {payload} : PayloadAction<IChat>) {
            state.chat = payload
        },

        setChatRef (state, {payload} : PayloadAction<HTMLElement>) {
            state.chatRef = payload as any
        },

        addMessage (state, {payload} : PayloadAction<string>) {
            if (state.chat) {
                let user : IUser = {
                    name : "test",
                    email : "test",
                    username : "test",
                    id : 0
                }
                // state.chat.messages.push({
                //     user,
                //     createdAt : String(Date.now()),
                //     text : payload
                // })
            }
        }
    }
})

export const ChatReducer = Chat.reducer
export const ChatActions = Chat.actions
export const ChatSelector = (state : RootState) => state.Chat
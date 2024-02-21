import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IChat } from "../../shared/ChatApi";
import IMessage from "../../shared/Message";
import { RootState } from "..";
import { IUser } from "../../shared/User";

interface InitialState {
    currentUser : IUser|null
}

const initialState : InitialState = {
    currentUser : null
}

const AppSlice = createSlice({
    initialState,
    name : "App",

    reducers : {
        setCurrentUser (state, {payload} : PayloadAction<IUser|null>) {
            state.currentUser = payload
        }
    }
})

export const AppReducer = AppSlice.reducer
export const AppActions = AppSlice.actions
export const AppSelector = (state : RootState) => state.App
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../../redux";

interface State {
    modal : string
}

const initialState : State = {
    modal : ""
}

const ModalSlice = createSlice({
    name : "modal",
    initialState,
    reducers : {

        setModal(state, {payload} : PayloadAction<string>) {
            state.modal = payload
        },

        closeModal (state) {
            state.modal = ""
        }

    }
})

export const ModalReducer = ModalSlice.reducer
export const ModalActions = ModalSlice.actions
export const ModalSelector = (state : RootState) => state.Modal
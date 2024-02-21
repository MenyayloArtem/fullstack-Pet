import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../../../redux";

export class AsideMenuItem {
    item : MenuValues
    payload : any
    randomId : number
    constructor(item : MenuValues, payload : any) {
        this.item = item
        this.payload = payload
        this.randomId = Math.random()
    }
}

interface State {
    menuStack : AsideMenuItem[],
    currentMenu : AsideMenuItem|null
}

const initialState : State = {
    menuStack : [],
    currentMenu : null
}

export enum MenuValues {
    User = "User",
    Chat = "Chat"
}

const AsideMenuSlice = createSlice({
    name : "asideMenu",
    initialState,
    reducers : {

        pushMenuStack (state, {payload} : PayloadAction<AsideMenuItem>) {
            if (!state.menuStack.some(i => i.payload === payload.payload)) {
                state.menuStack.push(payload)
                state.currentMenu = state.menuStack.at(-1)!
            }
        },

        popMenuStack (state) {
            if (state.menuStack.length > 1) {
                state.menuStack.pop()
                state.currentMenu = state.menuStack.at(-1)!
            }
        }

    }
})

export const AsideMenuReducer = AsideMenuSlice.reducer
export const AsideMenuActions = AsideMenuSlice.actions
export const AsideMenuSelector = (state : RootState) => state.AsideMenu
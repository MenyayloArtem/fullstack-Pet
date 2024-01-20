import { configureStore } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit/dist/createAction";
import { createSlice } from "@reduxjs/toolkit";
import { ChatMenuReducer } from "./slices/ChatMenuSlice";
import createSagaMiddleware from "@redux-saga/core";
import fetchUsersSaga from "./sagas/fetchUsers";
import { rootSaga } from "./sagas";
import { ChatReducer } from "./slices/ChatSlice";
import { ChatPageReducer } from "./slices/ChatPageSlice";

const initialState : {arr : any[]} = {
    arr : []
}

const sagaMiddleware = createSagaMiddleware()
const middleware = [sagaMiddleware]

export const store = configureStore({
    reducer : {
        Chat : ChatReducer,
        ChatMenu : ChatMenuReducer,
        ChatPage : ChatPageReducer
    },

    middleware : (g) => {
        return g({
            serializableCheck : false
        }).concat(middleware)
    }
})

sagaMiddleware.run(rootSaga)


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
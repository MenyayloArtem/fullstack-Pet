import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "@redux-saga/core";
import { rootSaga } from "./sagas";
import { ChatPageReducer } from "./slices/ChatPageSlice";
import {AsideMenuReducer} from "../modules/RightMenu/store/AsideMenuSlice";
import {ModalReducer} from "../modals/store/ModalSlice";
import {AppReducer} from "./slices/AppSlice";

const sagaMiddleware = createSagaMiddleware()
const middleware = [sagaMiddleware]

export const store = configureStore({
    reducer : {
        App : AppReducer,
        ChatPage : ChatPageReducer,
        AsideMenu : AsideMenuReducer,
        Modal : ModalReducer
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
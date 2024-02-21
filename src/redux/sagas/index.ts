import fetchUsersSaga from "./fetchData";
import messagesSaga from "./messages";
import {fork} from "redux-saga/effects";
import chatsSaga from "./chats";

export function* rootSaga () {
    yield fork(messagesSaga)
    yield fork(fetchUsersSaga)
    yield fork(chatsSaga)
}
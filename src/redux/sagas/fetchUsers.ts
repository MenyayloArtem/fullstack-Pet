import {call, takeEvery, put, fork, spawn, all, delay} from "redux-saga/effects"
import { ChatMenuActions } from "../slices/ChatMenuSlice"
import {IUser} from "../../shared/User"
import Api from "../../shared/Api"
import Chat, {fetchChannels, fetchFriends, fetchChats} from "../../shared/ChatApi"
import { ChatActions } from "../slices/ChatSlice"
import { ChatPageActions } from "../slices/ChatPageSlice"


function* handleChats () : IterableIterator<any> {
    const chats = yield call(fetchChats)
    yield put(ChatMenuActions.setChats(chats as any))
}

function* fetchUserWorker (action : any)  {
    try {
        yield spawn(handleChats)
        yield spawn(Chat.fetchChannels)
    } catch (error) {
        
    }
}

function* fetchUsersSaga() {
    yield takeEvery(ChatPageActions.fetchData().type, fetchUserWorker)
}

export default fetchUsersSaga
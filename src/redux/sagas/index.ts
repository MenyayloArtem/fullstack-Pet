import fetchUsersSaga from "./fetchUsers";

export function* rootSaga () {
    yield fetchUsersSaga()
}
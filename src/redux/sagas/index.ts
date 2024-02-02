import fetchUsersSaga from "./fetchData";

export function* rootSaga () {
    yield fetchUsersSaga()
}
import {useEffect, useState} from "react";

export default function useFetching(
    loadFn : (page : number) => Promise<any[]>
) {
    const [page, setPage] = useState(1)
    const [fetching, setFetching] = useState(false)
    const [canLoadMore, setCanLoadMore] = useState(true)
    const [canFetch, setCanFetch] = useState(false)

    useEffect(() => {
        if (!fetching && canLoadMore && canFetch) {
            setFetching(true)
            loadFn(page)
                .then((res) => {
                    setFetching(false)
                    setCanFetch(false)
                    setPage(p => p + 1)
                    if (!res.length) {
                        setCanLoadMore(false)
                    }
                    return new Promise((resolve) => {
                        resolve(res)
                    })
                })
        }
    }, [page, canLoadMore, fetching, canFetch]);

    useEffect(() => {
        return () => {
            reset()
        }
    }, []);

    const reset = () => {
        setPage(1)
        setCanLoadMore(true)
        setFetching(false)
    }

    return [setCanFetch, reset]
}
import {useCallback, useEffect, useRef, useState} from "react";

export default function (
    loadFn : (page : number) => Promise<any[]|undefined>,
    deps : any[],
    items : any[]
) {
    const [page, setPage] = useState(1)
    const [fetching, setFetching] = useState(false)
    const [canLoadMore, setCanLoadMore] = useState(true)
    const blockRef = useRef<any>()
    const [loadedOnce, setLoadedOnce] = useState(false)
    const [canScroll, setCanScroll] = useState(true)

    const load = useCallback(async (pg? : number) => {
        if (!fetching && canLoadMore) {
            setFetching(true)
            loadFn(pg || page)
                .then(res => {
                    if (res) {
                        setLoadedOnce(true)
                        console.log(res)
                        if (!res.length) {
                            setCanLoadMore(false)
                        }
                    }

                    setFetching(false)
                    return res
                })
        }
    },[page, fetching, canLoadMore, ...deps, loadedOnce])

    useEffect(() => {
        console.log("reset")
        setLoadedOnce(false)
        setPage(1)
        setCanLoadMore(true)
        setFetching(false)
    }, [...deps]);

    useEffect(() => {
        console.log([page, fetching, canLoadMore, ...deps, loadedOnce])
        if (!loadedOnce) {
            setPage(1)
        }

        if (!loadedOnce && page == 1) {
            load(1)
        }
    }, [page, fetching, canLoadMore, ...deps, loadedOnce]);

    const scrollHandler = useCallback((e : any) => {
        if (e.target.scrollTop <= 200) {
            if (items.length) {

                if (!fetching && canLoadMore) {
                    load(page + 1)
                        .then(() => {
                            setPage(p => p + 1)
                        })
                }

            }
        }
    }, [page, fetching, canLoadMore, items, loadedOnce])

    useEffect(() => {
        if (blockRef.current) {
            const el : HTMLElement = blockRef.current

            el.addEventListener("scroll", scrollHandler)

            return () => el.removeEventListener("scroll", scrollHandler)
        }
    }, [blockRef.current, page, fetching, canLoadMore, items, loadedOnce]);

    useEffect(() => {
        if (blockRef.current) {
            const el = blockRef.current
            const g = (e : any) => {
                if (e.target.scrollTop == e.target.scrollHeight - e.target.clientHeight) {
                    setCanScroll(true)
                } else {
                    setCanScroll(false)
                }
            }

            el.addEventListener("scroll", g)
            return () => el.removeEventListener("scroll", g)
        }
    }, [blockRef.current]);

    useEffect(() => {
        setCanScroll(true)
    }, [...deps]);

    return [blockRef as any, canScroll, setCanScroll]
}
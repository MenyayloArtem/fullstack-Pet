import {useEffect, useRef, useState} from "react";

interface Args<T> {
    initialPage? : number,
    loadFn : (page? : number) => Promise<T[]>,
    onLoad : (items : T[]) => void,
    onScroll? : (e : any) => void,
    resetDeps : any[]
}
export default function <T>(args : Args<T>) {
    const [page, setPage] = useState(args.initialPage || 0)
    const [fetching, setFetching] = useState(false)
    const [canLoadMore, setCanLoadMore] = useState(true)
    const blockRef = useRef<any>()

    useEffect(() => {
        // eslint-disable-next-line no-mixed-operators
        if (!fetching && canLoadMore || page === 0) {
            setFetching(true)
            args.loadFn(page)
                .then(res => {
                    if (!res.length) {
                        console.log("stop")
                        setCanLoadMore(false)
                    }
                    args.onLoad(res)
                    setFetching(false)
                    return res
                })
                .finally(() => {
                    setFetching(false)
                })
        }
    }, [page,fetching,canLoadMore])

    useEffect(() => {
        if (blockRef.current) {
            const el : HTMLElement = blockRef.current

            const scrollHandler = (e : any) => {
                if (e.target.scrollTop <= 100) {
                    e.preventDefault()
                    setPage(p => p + 1)
                }

                if (args.onScroll) {
                    args.onScroll(e)
                }
            }

            el.addEventListener("scroll", scrollHandler)
            return () => el.removeEventListener("scroll", scrollHandler)
        }
    }, [blockRef.current]);

    useEffect(() => {
        setFetching(false)
        setCanLoadMore(true)
        setPage(0)
        // eslint-disable-next-line react-hooks/exhaustive-deps
        console.log("reset")
    }, [...args.resetDeps, args.loadFn]);

    return [blockRef]
}
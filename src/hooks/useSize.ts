import { useEffect, useRef, useState } from "react"

export default function () : [DOMRect, any] {
    // const el = document.querySelector(selector)
    const [size, setSize] = useState<any>()
    const ref = useRef()


    // console.log(el)

    useEffect(() => {
        if (ref.current) {
            const el : Element = ref.current

            const fn = (el : Element) => {
                setSize(el.getBoundingClientRect())
            }

            const resizeObserver = new ResizeObserver((e) => {
                fn(e[0].target)
            })

            fn(el)
            // window.addEventListener("resize", fn)
            resizeObserver.observe(el)

            return () => {
                // window.removeEventListener('resize', fn)
                resizeObserver.unobserve(el)
            }
        } else {
            // throw new Error("Element not found")
        }
    }, [ref.current])

    return [size, ref]
}
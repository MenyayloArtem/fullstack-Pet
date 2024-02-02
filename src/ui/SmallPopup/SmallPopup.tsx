import React, {useEffect, useRef, useState} from "react"
import "./SmallPopup.scss"
interface Props {
    children : React.ReactNode,
    offsetY? : number
    targetElId : string
}
function SmallPopup(props : Props) {

    const [rect, setRect] = useState<DOMRect|null>(null)
    const popupRef = useRef<any>()
    useEffect(() => {
        let el = document.getElementById(props.targetElId)

        if (el) {
            const bodyRect = document.body.getBoundingClientRect()
            let newRect = el.getBoundingClientRect()
            setRect(newRect)
        } else {
            throw new Error(`Element with id ${props.targetElId} not found`)
        }
    }, []);

    return (rect) ? <div className="smallPopup"
                       ref={popupRef}
    style={{
        top : `${rect.y - (props?.offsetY || 0)}px`,
        pointerEvents : "none"
    }}
    >
        {props.children}
    </div> : <></>
}

export default SmallPopup
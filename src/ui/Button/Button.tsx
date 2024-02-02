import React from 'react';
import "./Button.scss"

interface Props {
    onClick? : Function,
    children? : React.ReactNode,
    className? : string
}

function Button (props : Props) {
    const onClick = () => {
        if (props.onClick) {
            props.onClick()
        }
    }
    return <div className={`Button ${props.className}`}
    onClick={onClick}
    >
        {props.children}
    </div>
}

export default Button
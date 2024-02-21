import React from 'react';
import "./Button.scss"
import {ClipLoader} from "react-spinners";

interface Props {
    onClick? : Function,
    children? : React.ReactNode,
    className? : string,
    small? : boolean,
    stretched? : boolean,
    fetching? : boolean
}

function Button (props : Props) {
    const onClick = () => {
        if (props.onClick) {
            props.onClick()
        }
    }
    return <div className={`Button ${props.small ? "small" : ""} ${props.className || ""} ${props.stretched ? "stretched" : ""}`}
    onClick={onClick}
    >
        {props.fetching ? <ClipLoader size={20} color={"#fff"}/> : props.children}
    </div>
}

export default Button
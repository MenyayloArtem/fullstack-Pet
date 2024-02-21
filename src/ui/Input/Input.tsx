import React from 'react';
import "./Input.scss"

interface Props {
    className? : string,
    placeholder? : string,
    after? : React.ReactNode,
    onInput : (text : string) => void,
    elRef? : any,
    value : string,
    stretched? : boolean,
    type? : "text"|"password"
}

function Input (props : Props) {
    return <div className={`Input ${props.className || ""} ${props.stretched ? "stretched" : ""}`}>
        <input type={props.type || "text"}
        className={`Input__input`}
        placeholder={props.placeholder}
        value={props.value}
        onInput={(e : any) => props.onInput(e.target.value as string)}
        ref={props.elRef}
        />
        <div className="Input__after">{
            props.after
        }</div>
    </div>
}

export default Input
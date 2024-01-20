import React from 'react';
import "./Counter.scss"

interface Props {
    before? : React.ReactNode,
    value : number
}

function Counter (props : Props) {
    return <div className="counter">
    {props.before && <div className="counter__before">
        {props.before}
    </div>}
    <div className="counter__value">
        {props.value}
    </div>
</div>
}

export default Counter
import React from 'react';
import "./LeftMenuList.scss"

interface Props<T> {
    title : string,
    items : T[],
    component : (item : T) => React.ReactNode
    onItemClick? : (item : T) => void
}

function LeftMenuList<T>(props : Props<T>) {
    const { items, title, component } = props
    
    return !!items.length ? <div className="leftMenuList">
    <div className="leftMenuList__row">
        <div className="leftMenuList__title">{title}</div>
        <div className="leftMenuList__count">{items.length}</div>
    </div>

    <div className="leftMenuList__list">
    {items.slice(0, 5).map((item) => {
        return component(item);
    })}
    </div>
</div> : <></>
}

export default LeftMenuList
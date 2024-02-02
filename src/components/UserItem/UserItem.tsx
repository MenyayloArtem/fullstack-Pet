import React from 'react';
import {IUser} from '../../shared/User';
import "./UserItem.scss"

interface Props {
    user : any,
    onClick : (user : IUser) => void
}

function UserItem(props : Props) {
    return (
        <div className="userItem" onClick={() => props.onClick(props.user)}>
            <div className="userItem__status"></div>
            <div className="userItem__avatar">
                <img src="../../assets/images/Avatar.png" alt=''/>
            </div>
            <div className="userItem__name">
                {props.user.username}
            </div>
        </div>
    );
}

export default UserItem;
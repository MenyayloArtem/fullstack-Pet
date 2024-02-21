import React from 'react';
import {IUser} from '../../shared/User';
import "./UserItem.scss"
import addClass from "../../helpers/addClass";

interface Props {
    user : any,
    onClick : (user : IUser) => void,
    after? : React.ReactNode,
    outlined? : boolean
}

function UserItem(props : Props) {
    return (
        <div className={`userItem ${addClass("outlined",props.outlined)}`} onClick={() => props.onClick(props.user)}>
            <div className="userItem__group">
                <div className="userItem__avatar">
                    <img src="../../assets/images/Avatar.png" alt=''/>
                    <div className="userItem__status"></div>
                </div>
                <div className="userItem__name">
                    {props.user.username}
                </div>
            </div>

            <div className="userItem__after">
                {props.after}
            </div>
        </div>
    );
}

export default UserItem;
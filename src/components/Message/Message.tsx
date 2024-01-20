import React from 'react';
import "./Message.scss"
import IMessage from '../../shared/IMessage';
import formatDate from '../../helpers/formatDate';

interface Props {
    message : IMessage
}

function Message (props : Props) {
    const {message} = props
    return <div className="message">
        <div className="message__avatar">
            <img src="./assets/images/Avatar.png" alt=""/>
        </div>
        <div className="message__col">
            <div className="message__top">
                <span className="message__user">
                    { message.user.name }
                </span>
                <span className='message__dispatchTime'>
                    { formatDate(message.createdAt) }
                </span>
                
            </div>
            <div className="message__text">
                { message.text }
            </div>
        </div>
    </div>
}

export default Message
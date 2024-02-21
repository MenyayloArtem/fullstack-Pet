import React from "react";
import IMessage from "../../shared/Message";

interface Props {
    message : IMessage,
    className? : string,
    after? : React.ReactNode
}
export default function ReplyMessage(props : Props) {
    const {message} = props
    return <div className={`message__reply replyMessage ${props.className || ""}`}>
        <div className="replyMessage__sender">
            {message.sender.username}
        </div>
        <div className="replyMessage__content">
            {message.content}

            {!!message.medias.length && <div>
                Фото
            </div>}
        </div>

        {props.after && <div className="replyMessage__after">
            {props.after}
        </div>}
    </div>
}
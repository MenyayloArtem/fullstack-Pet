import React, {useCallback, useRef, useState} from 'react';
import "./Message.scss"
import IMessage, {Media} from '../../shared/Message';
import formatDate from '../../helpers/formatDate';
import {useDispatch, useSelector} from "react-redux";
import {ChatPageActions, ChatPageSelector} from "../../redux/slices/ChatPageSlice";
import ReplyMessage from "./ReplyMessage";
import MediaManager from "../../helpers/MediaManager";
import Image from "./components/Image";
import isNumber from "../../helpers/isNumber";
import Audio from "./components/Audio";
import addClass from "../../helpers/addClass";

interface Props {
    message : IMessage,
    sizer? : number
}

function Message(props: Props) {
    const chatPage = useSelector(ChatPageSelector)
    const errorMessages = chatPage.errorMessages
    const messageRef = useRef<any>()
    const [selected, setSelected] = useState(false)
    const dispatch = useDispatch()

    const {message} = props

    const isError = errorMessages.some(msg => msg.id === message.id)

    function onClick () {
        if (chatPage.selectedMessages.some(m => m.id === message.id)) {
            dispatch(ChatPageActions.removeSelectedMessage(message))
        } else {
            dispatch(ChatPageActions.pushSelectedMessage(message))
        }
    }


    return <div className={`message__outer ${selected ? "selected" : ""}`}
    onClick={() => onClick()}
    >
        <div className={`message ${addClass("error", isError)}`} ref={messageRef}>

            <div className="message__col">
                <div className="message__row">
                    <div className="message__avatar">
                        <img src="./assets/images/Avatar.png" alt=""/>
                    </div>
                    <div className="message__top">
                <span className="message__user">
                    {message.sender.username}
                </span>
                        <span className='message__dispatchTime'>
                    {formatDate(message.dateCreated as any)}
                </span>
                    </div>
                </div>

                <div className="message__inner"
                     onClick={(e) => e.stopPropagation()}
                >
                    {message.reply_message && <ReplyMessage message={message.reply_message}/>}

                    <div className="message__text"

                    >
                        {message.content}
                        {

                            !!message.medias.length && message.medias.map(m => {
                                if (isNumber(m)) {
                                    return <></>
                                }
                                return MediaManager(m, {
                                    image: <Image media={m} key={m.id} sizer={props.sizer as any}/>,
                                    audio: <Audio m={m} key={m.id}/>
                                })
                            })
                        }
                    </div>
                </div>

            </div>
        </div>
    </div>

}

export default Message
import React, {useCallback, useRef, useState} from 'react';
import "./Message.scss"
import IMessage, {Media} from '../../shared/Message';
import formatDate from '../../helpers/formatDate';
import {useSelector} from "react-redux";
import {ChatPageSelector} from "../../redux/slices/ChatPageSlice";
import Api from "../../shared/Api";
var isNumber = function isNumber(value : any) {
    return typeof value === 'number' && isFinite(value);
}

interface Props {
    message : IMessage,
    sizer? : number
}

const calcHeight = (m : Media, sizer : number) => {
    if (sizer && m.props?.height) {
        return sizer / m.props.width * m.props.height
    }
    return undefined
}

function Image (props : {media : Media, sizer: number}) {
    let h = calcHeight(props.media,props.sizer)
    return <img src={`${Api.mediasUrl}/${props.media.id || props.media as any}`} key={props.media.id || props.media as any}
                width={props.sizer}
                height={h ? `${h}px` : undefined}
                alt=""/>
}

function Audio ({m} : {m : Media}) {
    return <audio controls>
        <source src={`${Api.mediasUrl}/${m.id}`}/>
    </audio>
}

function MediaManager (m : Media, components : any) {
    const type = m.type.split("/")[0]
    return components[type]
}

function Message(props: Props) {
    const errorMessages = useSelector(ChatPageSelector).errorMessages
    const messageRef = useRef<any>()

    const {message} = props

    const isError = errorMessages.some(msg => msg.id === message.id)



    return <div className={`message ${isError ? "error" : ""}`} ref={messageRef}>

        <div className="message__col" >
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

            <div className="message__text">
            {message.content}
                {

                !!message.medias.length && message.medias.map(m => {
                    if (isNumber(m)) {
                        return <></>
                    }
                        return MediaManager(m,{
                            image : <Image media={m} key={m.id} sizer={props.sizer as any}/>,
                            audio : <Audio m={m} key={m.id} />
                        })
                    })
                }
            </div>
        </div>
    </div>
}

export default Message
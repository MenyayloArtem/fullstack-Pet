import React, {useEffect, useState} from 'react';
import { useDispatch } from 'react-redux/es/exports';
import Button from '../../../../ui/Button/Button';
import "./AsideChatInfo.scss"
import { IUser } from '../../../../shared/User';
import {IChat} from "../../../../shared/ChatApi";
import Api from "../../../../shared/Api";
import {ModalActions} from "../../../../modals/store/ModalSlice";
import {ModalsEnum} from "../../../../modals/ModalRouter";
import {useSelector} from "react-redux";
import {ChatPageSelector} from "../../../../redux/slices/ChatPageSlice";
import IconCardImage from "../../../../components/icons/Image";
import addClass from "../../../../helpers/addClass";


function AsideChatInfo() {
    const chat = useSelector(ChatPageSelector).selectedChat
    const dispatch = useDispatch()
    const [showActions, setShowActions] = useState(false)

    const onClick = () => {
        dispatch(ModalActions.setModal(ModalsEnum.ConfirmLeaveModal))
    }

    if (chat) {
        return (
            <div className="chatInfo">
                <div className={`chatInfo__avatar ${addClass("empty", !chat.icon?.id)}`}>
                    {chat.icon?.id ?<img src={`${Api.mediasUrl}/${chat.icon?.id}`} alt=""/>
                        : <IconCardImage width={64} height={64} fill={"#ccc"} />
                    }
                </div>

                <div className="chatInfo__main">
                    <div className="chatInfo__name">
                        {chat.title} <div className="userItem__status"></div>
                    </div>
                    <div className="chatInfo__desc">
                        {chat.description}
                    </div>

                    <div className="chatInfo__socials socials">
                        <div className="social"><img src="./assets/icons/facebook.png" alt="fb"/></div>
                        <div className="social"><img src="./assets/icons/twitter.png" alt="tw"/></div>
                        <div className="social"><img src="./assets/icons/igram.png" alt="ig"/></div>
                        <div className="social"><img src="./assets/icons/in.png" alt="in"/></div>
                    </div>

                    <div className="chatInfo__buttons">
                        <div className="chatInfo__row">
                            <Button small onClick={onClick} stretched>Leave</Button>
                            <Button
                                small
                                className='actions'
                                onClick={() => setShowActions(s => !s)}
                            >
                                <img src="./assets/icons/down.png" alt='down' />
                            </Button>
                        </div>

                        {
                            showActions && <>
                                <Button small
                                        onClick={() => dispatch(ModalActions.setModal(ModalsEnum.EditChatModal))}
                                >Edit</Button>
                            </>
                        }
                    </div>


                    <div className="chatInfo__contacts">
                        <div className="chatInfo__contact contact">
                            <div className="contact__title">
                                Username
                            </div>
                            <div className="contact__value">
                                @menyayloartem
                            </div>
                        </div>

                        <div className="chatInfo__contact contact">
                            <div className="contact__title">
                                Username
                            </div>
                            <div className="contact__value">
                                @menyayloartem
                            </div>
                        </div>
                        <div className="chatInfo__contact contact">
                            <div className="contact__title">
                                Username
                            </div>
                            <div className="contact__value">
                                @menyayloartem
                            </div>
                        </div>

                        <div className="chatInfo__contact contact">
                            <div className="contact__title">
                                Username
                            </div>
                            <div className="contact__value">
                                @menyayloartem
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )
    } else {
        return <></>
    }

}

export default AsideChatInfo;
import React, {useEffect, useMemo, useRef, useState} from 'react';
import Message from '../../components/Message/Message';
import Counter from '../../ui/Counter/Counter';
import Input from '../../ui/Input/Input';
import "./ChatArea.scss"
import ChatInput from './components/ChatInput/ChatInput';
import ChatTopMenu from './components/ChatTopMenu/ChatTopMenu';
import { useDispatch, useSelector } from 'react-redux';
import { ChatMenuSelector } from '../../redux/slices/ChatMenuSlice';
import { ChatActions, ChatSelector } from '../../redux/slices/ChatSlice';
import scrollToBottom from '../../helpers/scrollToBottom';
import {ChatPageActions, ChatPageSelector} from '../../redux/slices/ChatPageSlice';
import useSize from "../../hooks/useSize";
import ChatApi from "../../shared/ChatApi";
import usePageLoad from "../../hooks/usePageLoad";
import IMessage from "../../shared/Message";
import Socket from "../../shared/Socket";

interface Props {

}

function ChatArea(props : Props) {
    const dispatch = useDispatch()
    const chatRedux = useSelector(ChatSelector)
    const chatPageRedux = useSelector(ChatPageSelector)
    const messages = useMemo(() =>chatPageRedux.selectedChat?.messages || [],[chatPageRedux.selectedChat?.messages])
    const [wasScrolled, setWasScrolled] = useState<boolean>(false)
    const [sizer, setSizer] = useState<number>()
    const [newMessages,setNewMessages] = useState(0)
    const [size, sizerRef] = useSize()
    const socket = new Socket()

    const [blockRef, canScroll] = usePageLoad(
        async (page) => {
            if (chatPageRedux.selectedChat?.id) {
                return ChatApi.getMessages(chatPageRedux.selectedChat.id, page)
                    .then((loadedMessages) => {
                        if (loadedMessages.length) {
                            dispatch(ChatPageActions.setMessages([...loadedMessages,...messages]))
                        }
                        return loadedMessages
                    })
            }
        },
        [chatPageRedux.selectedChat?.id],
        messages
    )

    useEffect(() => {
        socket.onMessage((res) => {
            let data = JSON.parse(res?.data)

            if (data.chatId === chatPageRedux.selectedChat?.id) {
                dispatch(ChatPageActions.addMessage(data.message))
            }

            if (!canScroll) {
                setNewMessages(m => m + 1)
            }
        })
    }, [chatPageRedux.selectedChat, canScroll]);



    useEffect(() => {
        if (size?.width) {
            setSizer(size.width)
        }
    }, [size]);

    useEffect(() => {
        if (canScroll) {
            setNewMessages(0)
        }
    }, [canScroll]);


    useEffect(() => {
        if (messages.length && !wasScrolled && blockRef.current) {
            setTimeout(() => {
                if (canScroll) {
                    scrollToBottom(blockRef.current as any)
                    setWasScrolled(true)
                }
            }, 0)
        }
    },[wasScrolled,messages,chatPageRedux.selectedChat?.id, canScroll])

    useEffect(() => {
        setWasScrolled(false)
    },[chatPageRedux.selectedChat])

    return (
        <main className="chat__body chatArea">

        <ChatTopMenu />

            {!!newMessages && <div className="chatArea__circle"
            onClick={() => scrollToBottom(chatRedux.chatRef as any)}
            >
                {newMessages}
            </div>}

        <div className="chatArea__messages">
            <div className="chatArea__messagesWrapper"
            ref={blockRef}
            >
                <div className="message sizer">
                    <div className="sizer" style={{width : "100%"}} ref={sizerRef}></div>
                </div>


                {

                !!sizer && messages.map((message) => <Message message={message} key={message.id} sizer={sizer}/>)
                }
            </div>
            
        </div>

        <ChatInput />

    </main>
    );
}

export default ChatArea;
import React, {useEffect, useMemo, useRef, useState} from 'react';
import Message from '../../components/Message/Message';
import "./ChatArea.scss"
import ChatInput from './components/ChatInput/ChatInput';
import ChatTopMenu from './components/ChatTopMenu/ChatTopMenu';
import { useDispatch, useSelector } from 'react-redux';
import scrollToBottom from '../../helpers/scrollToBottom';
import {ChatPageActions, ChatPageSelector} from '../../redux/slices/ChatPageSlice';
import useSize from "../../hooks/useSize";
import ChatApi from "../../shared/ChatApi";
import useFetching from "../../hooks/useFetching";
import Socket, {SocketMessageTypes} from "../../shared/Socket";

function ChatArea() {
    const dispatch = useDispatch()
    const chatPageRedux = useSelector(ChatPageSelector)
    const messages = useMemo(() => chatPageRedux.selectedChat?.messages || [],[chatPageRedux.selectedChat])
    const searchedMessages = chatPageRedux.searchedMessages
    const selectedChat = chatPageRedux.selectedChat
    const newMessages = chatPageRedux.newMessages
    const chatRef = useRef<any>()
    const [wasScrolled, setWasScrolled] = useState<boolean>(false)
    const [sizer, setSizer] = useState<number>()
    const [canScroll, setCanScroll] = useState(true)
    const [size, sizerRef] = useSize()
    const socket = new Socket()

    const [setCanFetching, resetFetching] = useFetching(
        (page) => ChatApi.getMessages(chatPageRedux.selectedChat!.id, page)
            .then(async (res) => {
                if (res.length) {
                    dispatch(ChatPageActions.setMessages([...res, ...messages]))
                } else {
                    if (page === 1) {
                        dispatch(ChatPageActions.setMessages([]))
                    }
                }
                return res
            })
    )

    useEffect(() => {
        // @ts-ignore
        resetFetching()
        setCanScroll(true)
        if (chatPageRedux.selectedChat?.id) {
            setCanFetching(true)
        }
    }, [chatPageRedux.selectedChat?.id]);

    useEffect(() => {
        console.log(messages)
    }, [messages]);

    useEffect(() => {
        if (chatRef.current) {
            // @ts-ignore
            function scrollHandler (e : any) {
                if (e.target.scrollTop <= 100) {
                    e.preventDefault()
                    setCanFetching(true)
                }

                if (e.target.scrollHeight <= e.target.scrollTop + e.target.clientHeight) {
                    setCanScroll(true)
                } else {
                    setCanScroll(false)
                }
            }

            chatRef.current.addEventListener("scroll",scrollHandler)
            return () => chatRef.current?.removeEventListener("scroll", scrollHandler)
        }
    }, [chatRef.current, sizer])

    useEffect(() => {
        if (size?.width) {
            setSizer(size.width)
        }
    }, [size]);

    useEffect(() => {
        if (messages.length && !wasScrolled && chatRef.current) {
            if (canScroll) {
                scrollToBottom(chatRef.current as any)
                setWasScrolled(true)
            }
        }
    },[wasScrolled,messages,chatPageRedux.selectedChat?.id, canScroll, newMessages])

    useEffect(() => {
        if (canScroll) {
            dispatch(ChatPageActions.setNewMessages(0))
        }
    }, [canScroll]);

    useEffect(() => {
        setWasScrolled(false)
    },[chatPageRedux.selectedChat])

    useEffect(() => {
        socket.onMessage((res) => {
            let data = JSON.parse(res?.data)
            console.log(data)
            switch (data?.type) {
                case SocketMessageTypes.NewMessage : {
                    if (data.chatId === selectedChat?.id) {
                        dispatch(ChatPageActions.addMessage(data.message))
                        if (!canScroll) {
                            dispatch(ChatPageActions.addNewMessages())
                        }
                    }
                    break
                }
                case SocketMessageTypes.EditMessage : {
                    if (data.chatId === selectedChat?.id) {
                        dispatch(ChatPageActions.replaceMessage({
                            message : data.message,
                            id : data.message.id
                        }))
                    }
                    break
                }
            }
        })
    }, [selectedChat, canScroll]);

    useEffect(() => {
        return () => {
            dispatch(ChatPageActions.clear())
        }
    }, []);

    return (
        <main className="chatArea">

        <ChatTopMenu />

        <div className="chatArea__messages">
            <div className="chatArea__messagesWrapper"
            ref={chatRef}
            >
                <div className="message sizer">
                    <div className="sizer" style={{width : "100%"}} ref={sizerRef}></div>
                </div>

                {
                    !!sizer && searchedMessages.length === 0 &&
                    messages.map((message) => <Message message={message} key={message.id} sizer={sizer}/>)
                }

                {
                  !!sizer && !!searchedMessages.length &&
                 searchedMessages.map((message) => <Message message={message} key={message.id} sizer={sizer}/>)
               }
            </div>

        </div>
            {!!chatPageRedux.newMessages && <div className="chatArea__scrollBottom"
            onClick={() => scrollToBottom(chatRef.current as any)}>
                {chatPageRedux.newMessages}
            </div>}
        <ChatInput chatRef={chatRef.current}/>
    </main>
    );
}

export default ChatArea;
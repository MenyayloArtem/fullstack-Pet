import React, { useEffect, useRef, useState } from 'react';
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

interface Props {

}

function ChatArea(props : Props) {
    const dispatch = useDispatch()
    const chatRedux = useSelector(ChatSelector)
    const chatPageRedux = useSelector(ChatPageSelector)
    const messages = chatPageRedux.selectedChat?.messages || []
    const chatRef = useRef<any>()
    const [wasScrolled, setWasScrolled] = useState<boolean>(false)
    const [sizer, setSizer] = useState<number>()
    const [canScroll, setCanScroll] = useState(true)
    const [canLoadMore, setcanLoadMore] = useState(true)
    const [fetching, setFetching] = useState(false)

    // const sizerRef = useRef<any>()
    const [size, sizerRef] = useSize()

    const [page, setPage] = useState<number>(1)

    async function fetchMessages () {
        if (chatPageRedux.selectedChat?.id && page > 1 && canLoadMore && !fetching) {
            setFetching(true)
            ChatApi.getMessages(chatPageRedux.selectedChat.id, page)
                .then(res => {

                    if (res.length) {
                        chatRedux.chatRef!.scrollBy(0,50)
                        dispatch(ChatPageActions.setMessages([...res, ...messages]))
                        setTimeout(() => {

                            chatRedux.chatRef!.scrollBy(0,-50)
                        },0)

                    } else {
                        setcanLoadMore(false)
                    }
                }).finally(() => {
                    setFetching(false)
            })
        }

    }

    useEffect(() => {
        fetchMessages()
    }, [page, canLoadMore, fetching]);


    useEffect(() => {
        if (!chatRedux.chatRef && chatRef.current && sizer) {
            dispatch(ChatActions.setChatRef(chatRef.current))
        }

        if (chatRef.current) {

            // @ts-ignore
            function scrollHandler (e : any) {
                if (e.target.scrollTop <= 100) {
                    e.preventDefault()
                    setPage(p => p + 1)
                }

                // if (e.target.scrollTop <= 20 && chatRedux?.chatRef) {
                //     (chatRedux.chatRef as any).scrollBy(0,100)
                // }

                if (e.target.scrollHeight <= e.target.scrollTop + e.target.clientHeight) {
                    setCanScroll(true)
                } else {
                    setCanScroll(false)
                }
            }
            chatRef.current.addEventListener("scroll",scrollHandler)

            return () => chatRef.current.removeEventListener("scroll", scrollHandler)
        }
    }, [chatRef.current, sizer])

    useEffect(() => {
        if (size?.width) {
            setSizer(size.width)
        }
    }, [size]);

    useEffect(() => {
        console.log(canScroll)
    }, [canScroll]);

    useEffect(() => {
        if (messages.length && !wasScrolled && chatRedux.chatRef) {
            setTimeout(() => {
                if (canScroll) {
                    scrollToBottom(chatRedux.chatRef as any)
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

        <div className="chatArea__messages">
            <div className="chatArea__messagesWrapper"
            ref={chatRef}
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
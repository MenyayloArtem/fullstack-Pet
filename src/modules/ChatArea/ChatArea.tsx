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
import { ChatPageSelector } from '../../redux/slices/ChatPageSlice';

interface Props {

}

function ChatArea(props : Props) {
    const dispatch = useDispatch()
    const chatRedux = useSelector(ChatSelector)
    const chatPageRedux = useSelector(ChatPageSelector)
    const messages = chatPageRedux.selectedChat?.messages || []
    const chatRef = useRef<any>()
    const [wasScrolled, setWasScrolled] = useState<boolean>(false)

    useEffect(() => {
        if (!chatRedux.chatRef && chatRef.current) {
            dispatch(ChatActions.setChatRef(chatRef.current))
        }
    }, [chatRef.current])

    useEffect(() => {
        if (messages.length && !wasScrolled && chatRedux.chatRef) {
            scrollToBottom(chatRedux.chatRef)
            setWasScrolled(true)
        }
    },[wasScrolled,messages])

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
                {
                    messages.map(message => <Message message={message} key={message.createdAt}/>)
                }
            </div>
            
        </div>

        <ChatInput />

    </main>
    );
}

export default ChatArea;
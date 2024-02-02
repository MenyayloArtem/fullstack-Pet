import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AsideUserInfo from '../../modules/AsideUserInfo/AsideUserInfo';
import ChatArea from '../../modules/ChatArea/ChatArea';
import ChatMenu from '../../modules/ChatMenu/ChatMenu';
import "../../scss/styles/index.scss"
import { ChatMenuSelector } from '../../redux/slices/ChatMenuSlice';
import { ChatPageActions, ChatPageSelector } from '../../redux/slices/ChatPageSlice';
import Api, { ApiRoutes } from '../../shared/Api';
import ChatApi from '../../shared/ChatApi';

interface Props {

}

function Chats (props : Props) {
    const dispatch = useDispatch()
    const chats = useSelector(ChatMenuSelector).chats
    const chatPage = useSelector(ChatPageSelector)
    const selectedUser = chatPage.selectedUser

    const messagesQueue = chatPage.messagesQueue
    const errorMessages = chatPage.errorMessages

    useEffect(() => {
        dispatch(ChatPageActions.fetchData())
      }, [])

    useEffect(() => {
        if (chats.length) {
            dispatch(ChatPageActions.setSelectedChat(chats[0]))
        }
    }, [chats, dispatch])

    return <div className="app">
    <div className="chat">
        
        <ChatMenu />
        
        <ChatArea />
        
        
        {selectedUser && <AsideUserInfo user={selectedUser}/>}

    </div>
</div>
}

export default Chats
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
    const selectedUser = useSelector(ChatPageSelector).selectedUser

    useEffect(() => {
        Api.login({
            "username" : "menyayloartem",
            "password" : "1234"
        })
        .then((user) => {
            console.log(user)
        })
        .finally(() => {
            ChatApi.getMembers(2)
            ChatApi.createChat({
                "title" : "test title",
                description : "test descr"
            }, 1)
            ChatApi.editChat({
                title : "edited",
                description : "edited"
            },1)
            ChatApi.getMembers(1)
            ChatApi.addMember(1,2)
            ChatApi.sendMessage(1, {
                text : "new message",
                media_ids : []
            })
        })
        
      }, [])

    useEffect(() => {
        dispatch(ChatPageActions.fetchData())
    },[])

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
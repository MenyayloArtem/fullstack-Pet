import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import RightMenu from '../../modules/RightMenu/RightMenu';
import ChatArea from '../../modules/ChatArea/ChatArea';
import ChatMenu from '../../modules/ChatMenu/ChatMenu';
import "../../scss/styles/index.scss"
import {ChatPageActions, ChatPageSelector} from '../../redux/slices/ChatPageSlice';
import {
    AsideMenuActions,
    AsideMenuItem,
    AsideMenuSelector,
    MenuValues
} from "../../modules/RightMenu/store/AsideMenuSlice";
import Api from "../../shared/Api";
function Chats () {
    const dispatch = useDispatch()
    const chatPage = useSelector(ChatPageSelector)
    const chats = chatPage.chats
    const asideMenu = useSelector(AsideMenuSelector)

    useEffect(() => {
        if (Api.currentUser) {
            dispatch(ChatPageActions.fetchData())
        }

      }, [Api.currentUser])

    useEffect(() => {
        if (chats.length && !chatPage.selectedChat) {
            dispatch(ChatPageActions.setSelectedChat(chats[0]))
            if (!asideMenu.menuStack.length) {
                dispatch(AsideMenuActions.pushMenuStack(new AsideMenuItem(
                    MenuValues.Chat,
                    chats[0]
                )))
            }
        }
    }, [chats.length, chatPage.selectedChat, dispatch, asideMenu])

    return <div className="chat__app">
    <div className="chat">
        
        <ChatMenu />
        
        <ChatArea />

        <RightMenu/>

    </div>
</div>
}

export default Chats
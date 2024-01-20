import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatChannel from "../../components/ChatChannel/ChatChannel";
import UserItem from "../../components/UserItem/UserItem";
import "./ChatMenu.scss";
import { ChatMenuActions, ChatMenuSelector } from "../../redux/slices/ChatMenuSlice";
import ChatIcon from "../../components/ChatIcon/ChatIcon";
import LeftMenuList from "./components/LeftMenuList/LeftMenuList";
import LeftMenuTop from "./components/ChatMenuTop/LeftMenuTop";
import { IChat } from "../../shared/ChatApi";
import { ChatActions, ChatSelector } from "../../redux/slices/ChatSlice";
import { ChatPageActions, ChatPageSelector } from "../../redux/slices/ChatPageSlice";
import { IUser } from "../../shared/User";

interface Props {
}

function ChatMenu(props: Props) {
  const chats = useSelector(ChatMenuSelector).chats

  const dispatch = useDispatch()
  const selectedChat = useSelector(ChatPageSelector).selectedChat
  const friends = selectedChat?.members || [];
  const channels = selectedChat?.channels || []

  const onUserItemClick = useCallback((user : IUser) => {
      console.log(user)
      dispatch(ChatPageActions.setSelectedUser(user))
  }, [])
  

  return (
    <div className="chat__menu">
      <div className="chatMenu">
        <div className="chatMenu__aside">
          {
            chats.map(chat => {
              return <ChatIcon icon={chat.icon}
              key={chat.id}
              selected={selectedChat?.id == chat.id}
              onClick={() => dispatch(ChatPageActions.setSelectedChat(chat))}
              />
            })
          }
        </div>

    
        <div className="chatMenu__body">
          <div className="chatMenu__background"></div>

          <LeftMenuTop />

          <div className="chatMenu__lists">
            <LeftMenuList
            title="channels"
            items={channels}
            component={(item) => <ChatChannel channel={item} key={item.name}/>}
            />

            <LeftMenuList 
            title="members"
            items={friends}
            component={(item) => <UserItem user={item} key={item.id} onClick={onUserItemClick}/>}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatMenu;

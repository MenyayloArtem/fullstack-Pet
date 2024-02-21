import React, {useCallback, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import ChatChannel from "../../components/ChatChannel/ChatChannel";
import UserItem from "../../components/UserItem/UserItem";
import "./ChatMenu.scss";
import RoundedIcon from "../../ui/RoundedIcon/RoundedIcon";
import LeftMenuList from "./components/LeftMenuList/LeftMenuList";
import LeftMenuTop from "./components/ChatMenuTop/LeftMenuTop";
import {IChat} from "../../shared/ChatApi";
import {ChatPageActions, ChatPageSelector, FETCH_CHAT_DATA} from "../../redux/slices/ChatPageSlice";
import {IUser} from "../../shared/User";
import {AsideMenuActions, AsideMenuItem, MenuValues} from "../RightMenu/store/AsideMenuSlice";
import {ModalActions} from "../../modals/store/ModalSlice";
import {ModalsEnum} from "../../modals/ModalRouter";
import Camera from "../../components/icons/Camera";
import AddIcon from "../../components/icons/AddIcon";
import Logout from "../../components/icons/Logout";


interface Props {
}

function ChatMenu(props: Props) {
  const chats = useSelector(ChatPageSelector).chats

  const dispatch = useDispatch()
  const selectedChat = useSelector(ChatPageSelector).selectedChat
  const friends = selectedChat?.members || [];
  const channels = selectedChat?.channels || []

  const onUserItemClick = useCallback((user : IUser) => {
      dispatch(ChatPageActions.setSelectedUser(user))
      dispatch(AsideMenuActions.pushMenuStack(new AsideMenuItem(
          MenuValues.User, user
      )))
  }, [])

  const onChatItemClick = useCallback((chat : IChat) => {
    if (chat.id != selectedChat?.id) {
      console.log(chat)
      dispatch(ChatPageActions.setSelectedChat(chat))
    }
  },[selectedChat?.id])



  useEffect(() => {
    if (selectedChat) {
      dispatch({type : FETCH_CHAT_DATA, payload : selectedChat.id})
    }
  }, [selectedChat?.id]);
  

  return (
    <div className="chat__menu">
      <div className="chatMenu">
        <div className="chatMenu__aside">
          <RoundedIcon selected={false}
          className={"currentUser"}
                       defaultContent={<img src={"./assets/images/Avatar.png"} />}
          />
          {
            chats.map(chat => {
              return <RoundedIcon icon={(chat.icon)}
              key={chat.id}
              selected={selectedChat?.id == chat.id}
              onClick={() => onChatItemClick(chat)}
                                  defaultContent={<Camera />}
              />
            })
          }
          <RoundedIcon selected={false}
          onClick={() => dispatch(ModalActions.setModal(ModalsEnum.CreateChatModal))}
                       defaultContent={<AddIcon />}
          />

          <Logout className={"logout"}
          onClick={() => dispatch(ModalActions.setModal(ModalsEnum.ConfirmLogoutModal))}
          />
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
            className={"users"}
            onTitleClick={() => dispatch(ModalActions.setModal(ModalsEnum.ChatMembersModal))}
            component={(item) => <UserItem user={item} key={item.id} onClick={onUserItemClick}/>}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatMenu;

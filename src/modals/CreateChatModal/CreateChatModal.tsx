import "./CreateChatModal.scss"
import ChatModal from "../templates/ChatModal/ChatModal";
import ChatApi from "../../shared/ChatApi";
import {useEffect, useState} from "react";
import {ChatPageActions, ChatPageSelector} from "../../redux/slices/ChatPageSlice";
import {ModalActions} from "../store/ModalSlice";
import {useDispatch, useSelector} from "react-redux";
import {Media} from "../../shared/Message";

export default function () {
    const dispatch = useDispatch()
    const chatsMenu = useSelector(ChatPageSelector)
    const [chatCreated, setChatCreated] = useState(false)
    const [fetching, setFetching] = useState(false)
    const createChat = (title : string, description : string, media? : Media) => {
        setFetching(true)
        ChatApi.createChat({title, description}, media?.id)
            .then(chat => {
                chat = (chat as any).message
                dispatch(ChatPageActions.addChat(chat))
                setChatCreated(true)
            })
    }

    useEffect(() => {
        console.log(chatsMenu.chats)
        if (chatCreated) {
            dispatch(ChatPageActions.setSelectedChat(chatsMenu.chats.at(-1)!))
            setFetching(false)
            dispatch(ModalActions.closeModal())
        }
    }, [chatsMenu.chats, chatCreated]);
    return <ChatModal title={"Создать чат"} buttonText={"Создать"} fetching={fetching} onButtonClick={createChat}/>
}
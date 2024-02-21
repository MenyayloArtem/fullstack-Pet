import ConfirmModal from "./templates/ConfirmModal/ConfirmModal";
import {useDispatch, useSelector} from "react-redux";
import {ModalActions} from "./store/ModalSlice";
import ChatApi from "../shared/ChatApi";
import {ChatPageActions, ChatPageSelector} from "../redux/slices/ChatPageSlice";
import {leaveChatAction} from "../redux/sagas/chats";
import {useEffect, useState} from "react";

export default function ConfirmLeaveModal() {
    const dispatch = useDispatch()
    const chatPage = useSelector(ChatPageSelector)
    const [chatRemoved, setChatRemoved] = useState(false)
    const onConfirm = () => {
        console.log("leave")
         ChatApi.leaveChat(chatPage.selectedChat!.id)
             .then(() => {
                dispatch(ChatPageActions.removeChat(chatPage.selectedChat!.id))
                 setChatRemoved(true)
            })
             // dispatch(leaveChatAction(chatPage.selectedChat!))
    }

    const onDeny = () => {
        dispatch(ModalActions.closeModal())
    }

    useEffect(() => {
        if (chatRemoved) {
            dispatch(ChatPageActions.setSelectedChat(chatPage.chats.at(-1) || null))
            dispatch(ModalActions.closeModal())
        }
    }, [chatPage.chats.length, chatRemoved]);

    return <ConfirmModal onConfirm={onDeny}
                         onDeny={onConfirm}
    title="Покинуть беседу?"
                         onConfirmText={"Остаться"}
                         onDenyText={"Выйти"}
    />
}
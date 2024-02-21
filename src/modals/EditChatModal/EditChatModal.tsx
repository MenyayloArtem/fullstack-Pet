import ChatModal from "../templates/ChatModal/ChatModal";
import {useDispatch, useSelector} from "react-redux";
import {ChatPageSelector} from "../../redux/slices/ChatPageSlice";
import {Media} from "../../shared/Message";
import {editChatAction} from "../../redux/sagas/chats";
import {ModalActions} from "../store/ModalSlice";

export default function () {

    const chat = useSelector(ChatPageSelector).selectedChat
    const dispatch = useDispatch()
    const save = (title : string, description : string, media? : Media) => {
        dispatch(editChatAction(title, description, chat!.id, media))
        dispatch(ModalActions.closeModal())
    }

    return <ChatModal title={"Редактировать чат"} chat={chat as any} buttonText={"Сохранить"} onButtonClick={save} />
}
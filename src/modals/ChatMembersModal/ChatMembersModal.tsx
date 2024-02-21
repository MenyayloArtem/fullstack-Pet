import ModalWithTitle from "../templates/ModalWithTitle/ModalWithTitle";
import {useDispatch, useSelector} from "react-redux";
import {ChatPageActions, ChatPageSelector} from "../../redux/slices/ChatPageSlice";
import UserItem from "../../components/UserItem/UserItem";
import "./ChatMembersModal.scss"
import ChatApi from "../../shared/ChatApi";
import {useEffect, useState} from "react";
import {IUser} from "../../shared/User";
import AddIcon from "../../components/icons/AddIcon";
import CloseIcon from "../../components/icons/CloseIcon";

export default function ChatMembersModal() {
    const chat = useSelector(ChatPageSelector)
    const dispatch = useDispatch()
    const iconSize = 32

    const [users, setUsers] = useState<IUser[]>([])

    const onClick = () => {

    }

    useEffect(() => {
        ChatApi.getAllUsers()
            .then(u => {
                console.log(u)
                setUsers(u)
            })
    }, []);

    const deleteMember = (member : IUser) => {
        dispatch(ChatPageActions.deleteMember(member))
        ChatApi.deleteMember(chat.selectedChat!.id, member.id)
            .catch(() => {
                dispatch(ChatPageActions.addMember(member))
                alert("При выполнении запроса произошла ошибка")
            })
    }

    const addMember = (member : IUser) => {
        dispatch(ChatPageActions.addMember(member))
        ChatApi.addMember(chat.selectedChat!.id, member.id)
            .catch(() => {
                dispatch(ChatPageActions.deleteMember(member))
                alert("При выполнении запроса произошла ошибка")
            })
    }

    return <ModalWithTitle isOpen={true} title={"Участники"}>
        <div className="chatMembersModal">
            <div className="chatMembersModal__list">
                {
                    chat.selectedChat && <>
                        {chat.selectedChat.members.map(member => {
                            return <UserItem user={member} onClick={onClick} after={<CloseIcon width={iconSize} height={iconSize}
                            onClick={() => deleteMember(member)}
                            />}/>
                        })}

                        {chat.selectedChat && users.filter(u => !chat.selectedChat!.members.some(u1 => u1.id === u.id)).map(member => {
                            return <UserItem outlined user={member} onClick={onClick} after={<AddIcon width={iconSize} height={iconSize}
                            onClick={() => addMember(member)}
                            />}/>
                        })}
                    </>


                }
            </div>
        </div>

    </ModalWithTitle>
}
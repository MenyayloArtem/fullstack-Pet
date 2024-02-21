import ReactModal from "react-modal";
import React, {useState} from "react";
import {useSelector} from "react-redux";
import {ModalSelector} from "./store/ModalSlice";
// import ConfirmModal from "./ConfirmModal";
import ConfirmLeaveModal from "./ConfirmLeaveModal";
import ChatModal from "./templates/ChatModal/ChatModal";
import ChatMembersModal from "./ChatMembersModal/ChatMembersModal";
import CreateChatModal from "./CreateChatModal/CreateChatModal";
import EditChatModal from "./EditChatModal/EditChatModal";
import ConfirmLogoutModal from "./ConfirmLogoutModal";
import ReactDOM from "react-dom/client";
import {createPortal} from "react-dom";

export enum ModalsEnum {
    ConfirmLeaveModal = "ConfirmLeaveModal",
    CreateChatModal = "CreateChatModal",
    EditChatModal = "EditChatModal",
    ChatMembersModal = "ChatMembersModal",
    ConfirmLogoutModal = "ConfirmLogoutModal"
}

const modalsEnum = {
    [ModalsEnum.ConfirmLeaveModal] : <ConfirmLeaveModal />,
    [ModalsEnum.CreateChatModal] : <CreateChatModal />,
    [ModalsEnum.ChatMembersModal] : <ChatMembersModal />,
    [ModalsEnum.EditChatModal] : <EditChatModal />,
    [ModalsEnum.ConfirmLogoutModal] : <ConfirmLogoutModal />,
}
function ModalRouter () {
    const modalRedux = useSelector(ModalSelector)
    // return <>
    //     {
    //         // @ts-ignore
    //         modalsEnum[`${modalRedux.modal}`] || null
    //     }
    // </>

    // @ts-ignore
    return createPortal(modalsEnum[`${modalRedux.modal}`] || null, document.body)
}
export default ModalRouter
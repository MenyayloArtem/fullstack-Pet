import Modal from "../../Modal";
import React from "react";
import "./ModalWithTitle.scss"
import addClass from "../../../helpers/addClass";
interface Props {
    title? : string,
    center? : boolean,
    isOpen : boolean,
    children : React.ReactNode
}
export default function ModalWithTitle(props : Props) {
    return <Modal isOpen={true}>
        <div className="modal">
            {props.title && <div className={`modal__title ${addClass("center", props.center)}`}>
                {props.title}
            </div>}
            <div className="modal__body">
                {props.children}
            </div>
        </div>
    </Modal>
}
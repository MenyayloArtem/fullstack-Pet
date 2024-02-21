import ReactModal from "react-modal";
import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {ModalActions} from "./store/ModalSlice";

interface Props {
    width? : number|string,
    height? : number|string,
    isOpen : boolean,
    onClose? : Function,
    children? : React.ReactNode
}
function Modal (props : Props) {
    // const [isOpen, setIsOpen] = useState(true)
    const {width, height, isOpen} = props
    const dispatch = useDispatch()
    return <ReactModal
        ariaHideApp={false}
        isOpen={isOpen}
        onRequestClose={() => dispatch(ModalActions.closeModal())}
        style={{
            overlay : {
                display : "flex",
                justifyContent : "center",
                background : "rgba(0,0,0,0.5)"
            },
            content : {
                width : width || 500,
                height : height || "auto",
                top: '50%',
                left: '50%',
                right: 'auto',
                bottom: 'auto',
                marginRight: '-50%',
                transform: 'translate(-50%, -50%)',
                background: "#fff",
                boxShadow: "2px 2px 6px rgba(0, 0, 0, 0.2)",
                padding: "15px 25px"
            }
        }}
    >
        {props.children}
    </ReactModal>
    }

    export default Modal
import Modal from "../../Modal";
import "./ConfirmModal.scss";
import ModalWithTitle from "../ModalWithTitle/ModalWithTitle";
import Button from "../../../ui/Button/Button";
import {useDispatch} from "react-redux";
import {ModalActions} from "../../store/ModalSlice";

interface Props {
    onConfirm : Function,
    onDeny? : Function,
    title : string,
    onConfirmText? : string,
    onDenyText? : string
}
export default function ConfirmModal(props : Props) {
    const dispatch = useDispatch()
    const onDeny = () => {
        if (props.onDeny) {
            props.onDeny()
        }
        // dispatch(ModalActions.closeModal())
    }
    return <ModalWithTitle isOpen={true} title={props.title}>
        <div className="confirmModal">
            <div className="confirmModal__buttons">
                <Button
                    className={"confirmModal__btn"}
                    onClick={() => props.onConfirm()}
                >{props.onConfirmText || "Да"}
                </Button>
                <Button
                    className={"confirmModal__btn warn"}
                    onClick={() => onDeny()}
                >{props.onDenyText ||"Нет"}
                </Button>
            </div>
        </div>

    </ModalWithTitle>
}
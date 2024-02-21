import ConfirmModal from "./templates/ConfirmModal/ConfirmModal";
import Api from "../shared/Api";
import {Navigate, redirect, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppActions, AppSelector} from "../redux/slices/AppSlice";
import {ModalActions} from "./store/ModalSlice";

export default function ConfirmLogoutModal() {
    const navigate = useNavigate()
    const [logouted, setLogouted] = useState(false)
    const user = useSelector(AppSelector).currentUser
    const dispatch = useDispatch()
    const leave = () => {
        Api.logout()
            .then(() => {
                dispatch(AppActions.setCurrentUser(null))

                dispatch(ModalActions.closeModal())
            })
    }

    useEffect(() => {
        console.log(user)
        if (!user) {

        }
    }, [user]);

    if (logouted) return <Navigate to={"/"} />
    return <ConfirmModal onConfirm={() => leave()} title={"Выйти из аккауниа"} />
}
import React, {useEffect, useState} from 'react';
import "./Main.scss"
import {Link, redirect, useNavigate} from "react-router-dom"
import Button from "../../ui/Button/Button";
import Input from "../../ui/Input/Input";
import Api from "../../shared/Api";
import {useDispatch, useSelector} from "react-redux";
import {AppActions, AppSelector} from "../../redux/slices/AppSlice";
import {GridLoader} from "react-spinners";
import {ChatPageActions} from "../../redux/slices/ChatPageSlice";

interface Props {
    fetching : boolean
}
function Main (props : Props) {
    const [username, setUsername] = useState("menyayloartem");
    const [password, setPassword] = useState("1234");

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector(AppSelector).currentUser
    const [fetching, setFetching] = useState(props.fetching)

    useEffect(() => {
        dispatch(ChatPageActions.clear())
    }, []);

    const login = () => {
        setFetching(true)
        Api.login({username, password})
            .then(res => {
                if (res) {
                    if (!res?.error) {
                        dispatch(AppActions.setCurrentUser(res))
                    }
                }
            })
            .catch(() => {
                alert("Wrong Credenitals")
            })
            .finally(() => {
                setFetching(false)
            })
    }

    useEffect(() => {
        setFetching(props.fetching)
    }, [props.fetching]);

    return <div
        className={"mainPage"}
    >
        {!props.fetching ? <div className="mainPage__form">
            <div className="mainPage__inner">
                <h1>Вход</h1>
                <Input onInput={setUsername} value={username} placeholder={"Логин"}/>
                <Input onInput={setPassword} value={password} type="password" placeholder={"Пароль"}/>
                <Button onClick={() => login()} fetching={fetching}>Войти</Button>
            </div>
        </div> : <GridLoader color={"#ccc"} />}
        {/*<Link to={"/chat"}>To chat</Link>*/}
    </div>
}

export default Main
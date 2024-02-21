import React, {useEffect, useState} from 'react';
import RightMenu from './modules/RightMenu/RightMenu';
import ChatArea from './modules/ChatArea/ChatArea';
import ChatMenu from './modules/ChatMenu/ChatMenu';
// import './scss/styles/index.scss';
import "./App.scss"
import {useDispatch, useSelector} from 'react-redux';
import {} from "react-router"
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Chat from './pages/Chat/Chat';
import Main from './pages/Main/Main';
import Api, { ApiRoutes } from './shared/Api';
import Socket from "./shared/Socket";
import ModalRouter from "./modals/ModalRouter";
import {AppActions, AppSelector} from "./redux/slices/AppSlice";

function App() {

  const [auth, setAuth] = useState(false)
    // const navigate = useNavigate()
    const user = useSelector(AppSelector).currentUser
    const dispatch = useDispatch()
    const [fetching, setFetching] = useState(true)

    useEffect(() => {
        if (auth) {
            let socket = new Socket()
            socket.onOpen((connection) => {
                console.log("Web Socket was connected!")
            })
        }
    }, []);

  useEffect(() => {
    if (!user) {
        try {
            Api.getCurrentUser()
                .then(user => {
                    if (user) {
                        Api.currentUser = user
                        dispatch(AppActions.setCurrentUser(user))
                    }
                })
                .catch(() => {
                    console.log("err")
                })
                .finally(() => {
                    setFetching(false)
                })
        } catch (e) {
            dispatch(AppActions.setCurrentUser(null))
        }

    }
  }, [])

    useEffect(() => {
        if (user) {
            setAuth(true)
        } else {
            setAuth(false)
        }
    }, [user]);

  // @ts-ignore
    return <div className="app">
    <Router>
            <ModalRouter />
          <Routes>
              <Route path="/" element={auth ? <Navigate to="/chats"/> : <Main fetching={fetching}/>}/>

              {/*@ts-ignore*/}
              <Route path={"/chats"} element={auth ? <Chat /> : <Navigate to={"/"}/>} isAuthenticated={Boolean(auth)} />
              <Route path="*" element={<Navigate to="/" />} />
          </Routes>
    </Router>
</div>
}
  


export default App;

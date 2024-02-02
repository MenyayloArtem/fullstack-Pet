import React, { useEffect } from 'react';
import AsideUserInfo from './modules/AsideUserInfo/AsideUserInfo';
import ChatArea from './modules/ChatArea/ChatArea';
import ChatMenu from './modules/ChatMenu/ChatMenu';
import './scss/styles/index.scss';
import "./App.scss"
import { ChatMenuSelector } from './redux/slices/ChatMenuSlice';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Chat from './pages/Chat/Chat';
import Main from './pages/Main/Main';
import Api, { ApiRoutes } from './shared/Api';
import Socket from "./shared/Socket";


function App() {

  const auth = true

    useEffect(() => {
        if (auth) {
            let socket = new Socket()
            socket.onOpen((connection) => {
                console.log("Web Socket was connected!")
            })
        }
    }, []);

  useEffect(() => {
    if (!Api.currentUser) {
        Api.getCurrentUser()
            .then(user => {
              Api.currentUser = user
            })
    }
  }, []);

  return <div className="app">
    <Router>
      <Routes>
        <Route path="/" element={auth ? <Navigate to="/chats" /> : <Main />} />
        <Route path="/chats" element={<Chat />} />
      </Routes>
    </Router>
</div>
}
  


export default App;

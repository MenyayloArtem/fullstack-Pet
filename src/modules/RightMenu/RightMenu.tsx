import React from 'react';
import "./RightMenu.scss"
import {useDispatch, useSelector} from "react-redux";
import {AsideMenuActions, AsideMenuSelector, MenuValues} from "./store/AsideMenuSlice";
import AsideUserInfo from "./components/AsideUserInfo/AsideUserInfo";
import {ChatPageSelector} from "../../redux/slices/ChatPageSlice";
import AsideChatInfo from "./components/AsideChatInfo/AsideChatInfo";
import ArrowLeft from "../../components/icons/ArrowLeft";

function RightMenu() {
    const menu = useSelector(AsideMenuSelector)
    const chatPage = useSelector(ChatPageSelector)
    const dispatch = useDispatch()

    return (
        <div className="asideMenu">
            {(menu.menuStack.length > 1) && <div className="asideMenu__back"
                  onClick={() => dispatch(AsideMenuActions.popMenuStack())}
            >
                <ArrowLeft />
            </div>}
            {(menu.currentMenu?.item === MenuValues.User && chatPage.selectedUser) && <AsideUserInfo user={menu.currentMenu.payload} />}
            {(menu.currentMenu?.item === MenuValues.Chat && chatPage.selectedChat) && <AsideChatInfo />}
        </div>
    );
}

export default RightMenu;
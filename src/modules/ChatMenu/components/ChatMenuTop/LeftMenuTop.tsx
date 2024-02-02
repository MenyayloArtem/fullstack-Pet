import React from 'react';
import "./LeftMenuTop.scss"
import {useDispatch, useSelector} from "react-redux";
import {ChatPageSelector, DELETE_MEMBER} from "../../../../redux/slices/ChatPageSlice";

interface Props {

}

function LeftMenuTop (props : Props) {
    const dispatch = useDispatch()
    const selectedChat = useSelector(ChatPageSelector).selectedChat

    const leave = () => {
        dispatch({type : DELETE_MEMBER, payload : {
            chat_id : selectedChat!.id,
                member_id : 1
            }})
    }
    return <div className="leftMenuTop">
    <div className="leftMenuTop__title">{selectedChat?.title || "Title"}</div>

    <div className="leftMenuTop__settings"
    onClick={leave}
    >
      <img src="./assets/icons/settings.svg" alt="settings" />
    </div>
  </div>
}

export default LeftMenuTop
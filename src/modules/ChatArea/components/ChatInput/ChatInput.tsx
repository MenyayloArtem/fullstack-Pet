import React, { useState } from 'react';
import "./ChatInput.scss"
import Input from '../../../../ui/Input/Input';
import { useDispatch, useSelector } from 'react-redux';
import { ChatSelector } from '../../../../redux/slices/ChatSlice';
import { ChatPageActions } from '../../../../redux/slices/ChatPageSlice';
import scrollToBottom from '../../../../helpers/scrollToBottom';

interface Props {

}

function ChatInput (props : Props) {
    const [text, setText] = useState<string>("")
    const dispatch = useDispatch()
    const chatRef = useSelector(ChatSelector).chatRef

    function sendMessage() {
        dispatch(ChatPageActions.addMessage(text))
        setText("")

        setTimeout(() => {
            if (chatRef) {
                scrollToBottom(chatRef)
            }
        },0)
    }


    return <div className="chatInput">
    <img src="./assets/icons/clip.png" alt="clip"/>
    <img src="./assets/icons/microfone.png" alt="microfone"/>
    <Input 
    placeholder='Message'
    className='chatInput__input'
    onInput={setText}
    value={text}
    />
    <img src="./assets/icons/microfone.png" alt="clip" onClick={() => sendMessage()}/>
</div>
}

export default ChatInput
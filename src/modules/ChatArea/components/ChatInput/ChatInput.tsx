import React, {useCallback, useEffect, useRef, useState} from 'react';
import "./ChatInput.scss"
import Input from '../../../../ui/Input/Input';
import { useDispatch, useSelector } from 'react-redux';
import { ChatSelector } from '../../../../redux/slices/ChatSlice';
import {ChatPageActions, ChatPageSelector, SEND_MESSAGE} from '../../../../redux/slices/ChatPageSlice';
import scrollToBottom from '../../../../helpers/scrollToBottom';
import SmallPopup from "../../../../ui/SmallPopup/SmallPopup";
import Api from "../../../../shared/Api";
import UploadedImage from "./components/UploadedImage";
import {upload} from "@testing-library/user-event/dist/upload";
import Socket from "../../../../shared/Socket";
import IMessage from "../../../../shared/Message";

interface Props {

}

function ChatInput (props : Props) {
    const [text, setText] = useState<string>("")

    const dispatch = useDispatch()
    const chatRef = useSelector(ChatSelector).chatRef
    const chatPage = useSelector(ChatPageSelector)
    const selectedChat = chatPage.selectedChat

    const [smilesVisible,setSmilesVisible] = useState(false)
    const uploadedImages = useSelector(ChatPageSelector).uploadedImages
    const inputRef = useRef<any>()
    let socket = new Socket()

    const sendMessage = useCallback(() => {

        if (text || uploadedImages.length) {
            dispatch({type : SEND_MESSAGE, payload : {
                    chatId : selectedChat!.id,
                    message : {
                        text,
                        media_ids : uploadedImages
                    }
                }})
        }

        setText("")

        setTimeout(() => {
            if (chatRef) {
                scrollToBottom(chatRef)
            }
        },0)

    },[text,uploadedImages])

    useEffect(() => {
        if (inputRef.current) {
            const cb = (e : any) => {
                if (e.key == "Enter") {
                    sendMessage()
                }
            }
            inputRef.current.addEventListener("keyup", cb)

            return () => inputRef.current.removeEventListener("keyup", cb)
        }

    }, [text, uploadedImages, inputRef.current]);

    useEffect(() => {

        socket.onMessage((res) => {
            let data = JSON.parse(res?.data)

            if (data.chatId == selectedChat?.id) {
                dispatch(ChatPageActions.addMessage(data.message))
            }

        })
    }, [selectedChat]);

    function onImageInput (e : any) {
        const img = (e.target.files[0])
        Api.upload(img)
        .then((res : any) => {
            dispatch(ChatPageActions.addUploadedMedias(res.media.id))

        })
            .finally(() => {
                e.target.value = ""
            })
    }

    const onImageRemove = useCallback( (id : number) => {
        dispatch(ChatPageActions.removeUploadedMedia(id))
    },[uploadedImages])


    return <div className="chatInput">
        <div className="chatInput__row img">
            {
                !!uploadedImages.length && uploadedImages.map(m => {
                    return <UploadedImage imageId={m} onRemove={onImageRemove} key={m}/>
                })
            }
        </div>
        <div className="chatInput__row">

            <label className="chatInput__fileInput">
                <input type="file" id={"file"} required
                       onInput={onImageInput}
                />

                <img src="./assets/icons/clip.png" alt="clip" id="clip"
                     // onClick={() => setSmilesVisible(v => !v)}
                />
            </label>

            <img src="./assets/icons/microfone.png" alt="microfone"/>
            {smilesVisible && <SmallPopup
            targetElId={"clip"}
            offsetY={20}
        >
            test
        </SmallPopup>}
    <Input 
    placeholder='Message'
    className='chatInput__input'
    onInput={setText}
    elRef={inputRef}
    value={text}
    />
    <img src="./assets/icons/microfone.png" alt="clip" onClick={() => sendMessage()}/>
    </div>
</div>
}

export default ChatInput
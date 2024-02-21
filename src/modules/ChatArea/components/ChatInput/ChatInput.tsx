import React, {useCallback, useEffect, useRef, useState} from 'react';
import "./ChatInput.scss"
import Input from '../../../../ui/Input/Input';
import {useDispatch, useSelector} from 'react-redux';
import {
    ChatPageActions,
    ChatPageSelector,
    editMessageAction,
    sendMessageAction
} from '../../../../redux/slices/ChatPageSlice';
import scrollToBottom from '../../../../helpers/scrollToBottom';
import SmallPopup from "../../../../ui/SmallPopup/SmallPopup";
import Api from "../../../../shared/Api";
import UploadedImage from "./components/UploadedImage";
import {Media} from "../../../../shared/Message";
import ReplyMessage from "../../../../components/Message/ReplyMessage";
import FileInput, {FileInputPresets} from "../../../../ui/FileInput/FileInput";

interface Props {
    chatRef : any
}
function ChatInput (props : Props) {
    const {chatRef} = props
    const [text, setText] = useState<string>("")
    const dispatch = useDispatch()
    const chatPage = useSelector(ChatPageSelector)
    const selectedChat = chatPage.selectedChat
    const [smilesVisible,setSmilesVisible] = useState(false)
    const uploadedImages = useSelector(ChatPageSelector).uploadedImages
    const inputRef = useRef<any>()

    const sendMessage = useCallback(() => {
        if (chatPage.editMessage) {
            dispatch(editMessageAction(selectedChat!.id, text, uploadedImages, chatPage.editMessage))
            setText("")
            return
        }

        if (text || uploadedImages.length) {
            dispatch(sendMessageAction(selectedChat!.id, text, uploadedImages, chatPage.reply_message?.id))
        }

        setText("")
        setTimeout(() => {
            if (chatRef) {
                scrollToBottom(chatRef)
            }
        },0)

    },[chatPage.editMessage, chatPage.reply_message?.id, chatRef, dispatch, selectedChat, text, uploadedImages])

    useEffect(() => {
        if (chatPage.editMessage) {
            setText(chatPage.editMessage.content || "")
            dispatch(ChatPageActions.setUploadedMedias(chatPage.editMessage.medias))
        }
    }, [chatPage.editMessage, dispatch]);

    useEffect(() => {
        if (inputRef.current) {
            const cb = (e : any) => {
                if (e.key === "Enter") {
                    sendMessage()
                }
            }
            
            inputRef.current.addEventListener("keyup", cb)
            // eslint-disable-next-line react-hooks/exhaustive-deps
            return () => inputRef.current?.removeEventListener("keyup", cb)
        }


    }, [text, uploadedImages, selectedChat, sendMessage]);

    function onImageInput (e : any) {
        const img = (e.target.files[0])
        Api.upload(img)
        .then((res : any) => {
            dispatch(ChatPageActions.addUploadedMedias(res.media))

        })
            .finally(() => {
                e.target.value = ""
            })
    }

    const onImageRemove = useCallback( (media : Media) => {
        dispatch(ChatPageActions.removeUploadedMedia(media))
    },[dispatch])

    return <div className="chatInput">

        {chatPage.reply_message && <ReplyMessage message={chatPage.reply_message}
        className={"inputReply"} after={<div onClick={() => dispatch(ChatPageActions.removeReplyMessage())}>
             X
            </div>}/>}

        {chatPage.editMessage && <ReplyMessage message={chatPage.editMessage}
             className={"inputReply"} after={<div
                 onClick={() => dispatch(ChatPageActions.removeEditMessage())}>
                 X
             </div>}/>}

        <div className="chatInput__row img">
            {
                !!uploadedImages.length && uploadedImages.map((m : any) => {
                    return <UploadedImage media={m} onRemove={onImageRemove} key={m}/>
                })
            }
        </div>
        <div className="chatInput__row">

            <FileInput preset={FileInputPresets.ClipPreset} onInput={onImageInput} />

            <img src="./assets/icons/microfone.png" alt="microfone"
            onClick={() => setSmilesVisible(v => !v)}
            />
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
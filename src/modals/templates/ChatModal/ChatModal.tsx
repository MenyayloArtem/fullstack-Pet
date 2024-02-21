import "./ChatModal.scss";
import Input from "../../../ui/Input/Input";
import {useEffect, useState} from "react";
import Button from "../../../ui/Button/Button";
import ChatApi, {IChat} from "../../../shared/ChatApi";
import FileInput, {FileInputPresets} from "../../../ui/FileInput/FileInput";
import Api from "../../../shared/Api";
import {Media} from "../../../shared/Message";
import ModalWithTitle from "../ModalWithTitle/ModalWithTitle";

interface Props {
    title : string,
    buttonText : string,
    onButtonClick : (title : string, description : string, media? : Media) => void,
    onMediaLoad? : (media : Media) => void,
    chat? : IChat,
    fetching? : boolean
}
export default function ChatModal(props : Props) {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [media, setMedia] = useState<Media|undefined>(undefined)

    const onButtonClick = () => {
        if (title && !props.fetching) {
            props.onButtonClick(title,description,media)
        } else {
            alert("Необходимо заполнить заголовок")
        }
    }
    const mediaLoaded = (media : Media) => {
        if (props.onMediaLoad) {
            props.onMediaLoad(media)
        }
    }
    const onInput = (e : any) => {
        const img = (e.target.files[0])
        Api.upload(img)
            .then((res : any) => {
                setMedia(res.media)
                mediaLoaded(res.media)
            })
            .finally(() => {
                e.target.value = ""
            })
    }

    useEffect(() => {
        if (props.chat) {
            setTitle(props.chat.title)
            setDescription(props.chat.description)
            setMedia(props.chat.icon)
        }
    }, [props?.chat]);

    return <ModalWithTitle title={props.title} center isOpen={true}>
        <div className="chatModal">
            <FileInput preset={FileInputPresets.PhotoPreset} onInput={onInput} media={media}
            onMediaClear={() => setMedia(undefined)}
            />
            <Input onInput={setTitle} value={title} stretched placeholder={"Заголовок"}/>
            <Input onInput={setDescription} value={description} stretched placeholder={"Описание"}/>
            <Button onClick={() => onButtonClick()} stretched fetching={props.fetching}>{props.buttonText}</Button>
        </div>
    </ModalWithTitle>
}
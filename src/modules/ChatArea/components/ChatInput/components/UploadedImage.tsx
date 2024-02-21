import React from "react"
import Api from "../../../../../shared/Api";
import "./UploadedImage.scss"
import {Media} from "../../../../../shared/Message";

interface Props {
    media : Media,
    onClick? : Function,
    onRemove : (media : Media) => void
}
function UploadedImage(props : Props) {
    const { media, onClick, onRemove} = props
    return <div className="uploadedImage" onClick={() => onClick ? onClick() : null}>
        <img src={`${Api.mediasUrl}/${media.id}`} alt="" className="uploadedImage__image"/>
        <div className="uploadedImage__remove" onClick={() => onRemove(media)}>
            X
        </div>
    </div>
}

export default UploadedImage
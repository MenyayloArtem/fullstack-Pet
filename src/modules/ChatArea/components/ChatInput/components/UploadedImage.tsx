import React from "react"
import Api from "../../../../../shared/Api";
import "./UploadedImage.scss"

interface Props {
    imageId : number,
    onClick? : Function,
    onRemove : (imgId : number) => void
}
function UploadedImage(props : Props) {
    const { imageId, onClick, onRemove} = props
    return <div className="uploadedImage" onClick={() => onClick ? onClick() : null}>
        <img src={`${Api.mediasUrl}/${imageId}`} alt="" className="uploadedImage__image"/>
        <div className="uploadedImage__remove" onClick={() => onRemove(imageId)}>
            X
        </div>
    </div>
}

export default UploadedImage
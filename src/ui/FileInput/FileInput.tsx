import React from "react";
import "./FileInput.scss"
import Camera from "../../components/icons/Camera";
import {Colors} from "../../helpers/Colors";
import {Media} from "../../shared/Message";
import Api from "../../shared/Api";
import IconClose from "../../components/icons/CloseIcon";
interface Props {
    onInput : (e : any) => void
}

interface InputProps extends Props {
    preset : FileInputPresets
}
interface PhotoPresetProps extends InputProps {
    media? : Media,
    onMediaClear? : Function
}



export enum FileInputPresets {
    ClipPreset = "ClipPreset",
    PhotoPreset = "PhotoPreset"
}
function ClipPreset (props : Props) {
    return <label className="fileInput clipPreset">
        <input type="file" id={"file"} required
               onInput={props.onInput}
        />

        <img src="./assets/icons/clip.png" alt="clip" id="clip"
        />
    </label>
}

function PhotoPreset (props : PhotoPresetProps) {
    const iconSize = 75

    const clearMedia = () => {
        if (props.onMediaClear) {
            props.onMediaClear()
        }
    }
    return <>
        {!props.media ? <label className={"fileInput photoPreset"}>
            <input type="file" id={"file"} required
                   onInput={props.onInput}
            />

            <Camera width={iconSize} height={iconSize} fill={Colors.Blue}/>
        </label> : <div className={"loadedImage"}>
            <div className="loadedImage__black">
                <IconClose onClick={() => clearMedia()}/>
            </div>
            <img className={"loadedImage"} src={`${Api.mediasUrl}/${props.media!.id}`} alt={"photo"} />
        </div>
        }
    </>
}

const FileInputsEnum = (props: any) => {
    return {
        [FileInputPresets.ClipPreset]: <ClipPreset {...props}/>,
        [FileInputPresets.PhotoPreset]: <PhotoPreset {...props}/>
    }
}

export default function FileInput(props: InputProps|PhotoPresetProps) {
    return FileInputsEnum(props)[props.preset]
}
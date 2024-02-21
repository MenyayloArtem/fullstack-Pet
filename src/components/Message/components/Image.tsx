import {Media} from "../../../shared/Message";
import Api from "../../../shared/Api";
import React from "react";
import calcHeight from "../../../helpers/calcHeight";

export default function Image (props : {media : Media, sizer: number}) {
    let h = calcHeight(props.media,props.sizer)
    return <img src={`${Api.mediasUrl}/${props.media.id || props.media as any}`} key={props.media.id || props.media as any}
                width={props.sizer}
                height={h ? `${h}px` : undefined}
                alt=""/>
}
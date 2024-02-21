import {Media} from "../../../shared/Message";
import Api from "../../../shared/Api";
import React from "react";

export default function Audio ({m} : {m : Media}) {
    return <audio controls>
        <source src={`${Api.mediasUrl}/${m.id}`}/>
    </audio>
}
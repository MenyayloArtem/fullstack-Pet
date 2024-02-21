import React from 'react';
import "./RoundedIcon.scss"
import Api from "../../shared/Api";
import {Media} from "../../shared/Message";
import addClass from "../../helpers/addClass";

interface Props {
    icon? : Media,
    selected : boolean,
    onClick? : () => void,
    className? : string,
    defaultContent? : React.ReactNode
}

function RoundedIcon (props : Props) {
    let url = props.icon ? Api.mediasUrl+"/"+props.icon.id : "./assets/images/Chat.png"


    const onClick = () => {
      if (props.onClick) {
        props.onClick()
      }
    }
    
    return <div className={`roundedIcon ${addClass("selected", props.selected)} ${addClass(props.className as any, props.className as any)}`}
    onClick={() => onClick()}
    >
      <div className="roundedIcon__inner">
          {(props.icon || !props.defaultContent) && <img className='roundedIcon__img' src={url} alt="chat"/>}
          {(!props.icon?.id && props.defaultContent) && props.defaultContent}
      </div>
    
  </div>
}

export default RoundedIcon
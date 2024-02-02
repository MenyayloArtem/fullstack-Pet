import React from 'react';
import "./ChatIcon.scss"

interface Props {
    icon? : string,
    selected : boolean,
    onClick? : () => void
}

function ChatIcon (props : Props) {
    let url = props.icon || "./assets/images/Chat.png"

    const onClick = () => {
      if (props.onClick) {
        props.onClick()
      }
    }
    
    return <div className={`chatIcon ${props.selected ? "selected" : ""}`}
    onClick={() => onClick()}
    >
      <div className="chatIcon__inner">
        <img className='chatIcon__img' src={url} alt="chat" />
      </div>
    
  </div>
}

export default ChatIcon
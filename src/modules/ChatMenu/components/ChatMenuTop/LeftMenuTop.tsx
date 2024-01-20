import React from 'react';
import "./LeftMenuTop.scss"

interface Props {

}

function LeftMenuTop (props : Props) {
    return <div className="leftMenuTop">
    <div className="leftMenuTop__title">Title</div>

    <div className="leftMenuTop__settings">
      <img src="./assets/icons/settings.svg" alt="settings" />
    </div>
  </div>
}

export default LeftMenuTop
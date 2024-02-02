import React, {useEffect} from 'react';
import "./Main.scss"
import {Link, redirect, useNavigate} from "react-router-dom"

interface Props {

}

function Main (props : Props) {
    return <div>
        <Link to={"/chat"}>To chat</Link>
    </div>
}

export default Main
import React from 'react';
import { useDispatch } from 'react-redux/es/exports';
import Button from '../../../../ui/Button/Button';
import "./AsideUserInfo.scss"
import { IUser } from '../../../../shared/User';

interface Props {
    user : IUser
}

function AsideUserInfo(props : Props) {

    const { user } = props

    const dispatch = useDispatch()

    const onClick = () => {

    }

    return (
        <div className="userInfo">
            <div className="userInfo__avatar">
                <img src="./assets/images/Avatar.png" alt=""/>
            </div>

            <div className="userInfo__main">
                <div className="userInfo__name">
                    {user.username} <div className="userItem__status"></div>
                </div>
                <div className="userInfo__desc">
                    {user.email}
                </div>

                <div className="userInfo__socials socials">
                    <div className="social"><img src="./assets/icons/facebook.png" alt="fb"/></div>
                    <div className="social"><img src="./assets/icons/twitter.png" alt="tw"/></div>
                    <div className="social"><img src="./assets/icons/igram.png" alt="ig"/></div>
                    <div className="social"><img src="./assets/icons/in.png" alt="in"/></div>
                </div>

                <div className="userInfo__buttons">
                    <Button small onClick={onClick} >Message</Button>
                    <Button
                        small
                        className='actions'
                    >
                        <img src="./assets/icons/down.png" alt='down' />
                    </Button>
                </div>


                <div className="userInfo__contacts">
                    <div className="userInfo__contact contact">
                        <div className="contact__title">
                            Username
                        </div>
                        <div className="contact__value">
                            @menyayloartem
                        </div>
                    </div>

                    <div className="userInfo__contact contact">
                        <div className="contact__title">
                            Username
                        </div>
                        <div className="contact__value">
                            @menyayloartem
                        </div>
                    </div>
                    <div className="userInfo__contact contact">
                        <div className="contact__title">
                            Username
                        </div>
                        <div className="contact__value">
                            @menyayloartem
                        </div>
                    </div>

                    <div className="userInfo__contact contact">
                        <div className="contact__title">
                            Username
                        </div>
                        <div className="contact__value">
                            @menyayloartem
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default AsideUserInfo;
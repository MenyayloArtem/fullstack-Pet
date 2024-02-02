import React, { useState } from 'react';
import "./ChatTopMenu.scss"
import Counter from '../../../../ui/Counter/Counter';
import Input from '../../../../ui/Input/Input';

interface Props {

}

function ChatTopMenu (props : Props) {
    const [searchValue, setSearchValue] = useState<string>("")
    return <div className="chatTopMenu__top">
    <div className="chatTopMenu__channelName">
        <div className="chatChannel__dash">
            #
        </div>
        <div className="chatChannel__title">
            Channel Name
        </div>
    </div>

    <div className="chatTopMenu__widgets">

        <Counter 
        value={1000}
        before={<img src="./assets/images/UserIcon.png" alt=""/>}
        />

        <Input 
        className='search'
        placeholder='Search..'
        after={<img src="./assets/images/search.png" alt=""/>}
        onInput={setSearchValue}
        value={searchValue}
        />

        <div className="notifications">
            <img src="./assets/images/notification.png" alt=""/>
        </div>

        <div className="actions">
            <img src="./assets/images/actions.png" alt=""/>
        </div>
    </div>
</div>
}

export default ChatTopMenu
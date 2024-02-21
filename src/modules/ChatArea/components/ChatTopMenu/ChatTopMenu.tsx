import React, {useEffect, useState} from 'react';
import "./ChatTopMenu.scss"
import Counter from '../../../../ui/Counter/Counter';
import Input from '../../../../ui/Input/Input';
import {useDispatch, useSelector} from "react-redux";
import {ChatPageActions, ChatPageSelector} from "../../../../redux/slices/ChatPageSlice";
import ChatApi from "../../../../shared/ChatApi";
import Button from "../../../../ui/Button/Button";
import Api from "../../../../shared/Api";
import message from "../../../../components/Message/Message";
import CloseIcon from "../../../../components/icons/CloseIcon";

interface Props {

}

function ChatTopMenu (props : Props) {
    const [searchValue, setSearchValue] = useState<string>("")
    const chatRedux = useSelector(ChatPageSelector)
    const dispatch = useDispatch()
    const selectedMessages = chatRedux.selectedMessages

    function search () {
        if (searchValue) {
            ChatApi.searchMessages(chatRedux.selectedChat!.id, searchValue)
                .then(m => dispatch(ChatPageActions.setSearchedMessages(m)))
        }
    }

    useEffect(() => {
        if (!searchValue) {
            dispatch(ChatPageActions.clearSearchedMessages())
        }
    }, [searchValue]);

    return <div className="chatTopMenu__top">
        {!selectedMessages.length && <div className="chatTopMenu__row">
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
                    value={chatRedux.selectedChat?.membersCount || 0}
                    before={<img src="./assets/images/UserIcon.png" alt=""/>}
                />

                <Input
                    className='search'
                    placeholder='Search..'
                    after={<img src="./assets/images/search.png" alt=""
                                onClick={() => search()}
                    />}
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
        </div>}


        {
            !!selectedMessages.length && <div className={"chatTopMenu__row"}>
            <div>{selectedMessages.length}</div>
            <div className={"chatTopMenu__buttons"}>
                {selectedMessages.length === 1 && <Button small
                onClick={() => dispatch(ChatPageActions.setReplyMessage(selectedMessages[0].id))}
                >Ответить</Button>}

                {(selectedMessages.length === 1 &&
                selectedMessages[0].sender.id === Api.currentUser?.id) &&
                <Button small
                onClick={() => dispatch(ChatPageActions.setEditMessage(selectedMessages[0]))}
                >Редактировать</Button>}

                <CloseIcon className={"clear"}
                           onClick={() => dispatch(ChatPageActions.clearSelectedMessages())}
                />
            </div>

            </div>
        }
    </div>
}

export default ChatTopMenu
import React from 'react';
import "./ChatChannel.scss"
import { IChannel } from '../../shared/Channel';

interface Props {
    channel : IChannel
}

function ChatChannel(props : Props) {
    const {channel} = props
    return (
        <div className="chatChannel active">
            <div className="chatChannel__dash">
                #
            </div>

            <div className="chatChannel__title">
                {channel.name}
            </div>
        </div>
    );
}

export default ChatChannel;
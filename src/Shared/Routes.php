<?php

namespace App\Shared;

class Routes
{

    const prefix = "/api";
    // Login
    const login = '/login';
    const logout = "/logout";

    // Chats
    const chats = self::prefix."/chats";
    const chat = self::prefix."/chat";
    const chatIdRef = self::prefix."/chat";
    const chatMessage = self::prefix."/messages";
    const chatMessagesGet = self::prefix."/messagesGet";
    const searchChatMessages = self::prefix."/searchMessages";
    const chatMembers = self::prefix."/chatMembers";
    const leaveChat = self::prefix."/leaveChat";
    const chatMembership = self::prefix."/checkMembership";
    const uploadDir = "/home/myubuntu/Box/PhpTest/test/upload";
}
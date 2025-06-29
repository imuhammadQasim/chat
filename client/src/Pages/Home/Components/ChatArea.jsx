import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createNewMessage, getAllMessages } from '../../../apiCalls/message';
import { showLoader, hideLoader } from '../../../redux/loaderSlice';
import { toast } from 'react-hot-toast';
import moment from 'moment';
import { clearUnreadMessageCount } from '../../../apiCalls/chat';
import { setAllChat } from '../../../redux/userSlice';
import { Socket } from 'socket.io-client';
import store from '../../../redux/store.js'
const ChatArea = ({ socket }) => {
  const dispatch = useDispatch();
  const { selectedChat, user, allChats } = useSelector((state) => state.user);
  const selectedUser = selectedChat?.members?.find((u) => u._id !== user._id);

  const [message, setMessage] = useState('');
  const [allMessages, setAllMessages] = useState([]);
  const messageInputRef = useRef();

  const sendMessage = async (text) => {
    try {
      const newMessage = {
        chatId: selectedChat._id,
        senderId: user._id,
        content: text,
      };

      socket.emit('send-message', {
        ...newMessage,
        members: selectedChat.members.map(m => m._id),
        read: false,
        createdAt: moment().format('YYYY-MM-DD hh:mm')
      })

      const response = await createNewMessage(newMessage);

      if (response.success) {
        setMessage('');
        setAllMessages((prev) => [...prev, response.data]);
      } else {
        toast.error(response.message || 'Message failed');
      }
    } catch (error) {
      dispatch(hideLoader());
      console.error(error);
      toast.error('Failed to send message');
    }
  };

  const clearUnreadMessages = async () => {
    try {
      dispatch(showLoader());
      const response = await clearUnreadMessageCount(selectedChat._id);
      dispatch(hideLoader());

      if (response.success) {
        const updatedChats = allChats.map((chat) =>
          chat._id === selectedChat._id ? response.data : chat
        );
        dispatch(setAllChat(updatedChats));
      } else {
        toast.error(response.message || 'Failed to clear unread messages');
      }
    } catch (error) {
      dispatch(hideLoader());
      console.error(error);
      toast.error('Failed to clear unread messages');
    }
  };

  const getMessages = async () => {
    try {
      dispatch(showLoader());
      const response = await getAllMessages(selectedChat._id);
      dispatch(hideLoader());

      if (response.success) {
        setAllMessages(response.data);
      } else {
        toast.error(response.message || 'Failed to get messages');
      }
    } catch (error) {
      dispatch(hideLoader());
      console.error(error);
      toast.error('Failed to get messages');
    }
  };

  const handleSendClick = () => {
    if (message.trim()) {
      sendMessage(message.trim());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendClick();
    }
  };

  useEffect(() => {
    if (selectedChat?._id) {
      getMessages();
      if (selectedChat?.lastMessage?.senderId !== user._id) {
        clearUnreadMessages();
      }
      if (messageInputRef.current) {
        messageInputRef.current.focus();
      }
    }

    const handleIncomingMessage = (data) => {
      const currentChat = store.getState().user.selectedChat;
      if (currentChat?._id === data.chatId) {
        setAllMessages((prevMsgs) => [...prevMsgs, data]);
      }
    };

    socket.on('recieve-message', handleIncomingMessage);

    return () => {
      socket.off('recieve-message', handleIncomingMessage);
    };


  }, [selectedChat]);


  useEffect(() => {
    const msgContainer = document.getElementById('main-chat-area');
    msgContainer.scrollTop = msgContainer.scrollHeight;
  }, [allMessages]);


  return (
    <>
      {selectedChat?._id && (
        <div className="app-chat-area">
          <div className="app-chat-area-header">
            {selectedUser &&
              `${selectedUser.firstname.charAt(0).toUpperCase() + selectedUser.firstname.slice(1)} ${selectedUser.lastname.charAt(0).toUpperCase() + selectedUser.lastname.slice(1)}`}
          </div>

          <div className="main-chat-area" id='main-chat-area'>
            {allMessages.map((msg) => {
              const isCurrentUserSender =
                msg.senderId?._id === user._id || msg.senderId === user._id;

              return (
                <div
                  className={`message-wrapper ${isCurrentUserSender ? 'align-right' : 'align-left'}`}
                  key={msg._id}>
                  <div className="message-bubble">
                    <div className={isCurrentUserSender ? 'send-message' : 'received-message'}>
                      {msg.content}
                    </div>
                    <div
                      className="msg-timestamp"
                      style={{
                        alignSelf: isCurrentUserSender ? 'flex-end' : 'flex-start',
                        textAlign: isCurrentUserSender ? 'right' : 'left',
                      }}
                    >
                      {moment(msg.createdAt).format('hh:mm A')}{' '}
                      {isCurrentUserSender && msg.read && (
                        <i className="fa fa-check-circle" style={{ color: '#e74c3c' }}></i>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="send-message-div">
            <input
              type="text"
              className="send-message-input"
              placeholder="Type a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              ref={messageInputRef}
            />
            <button
              className="fa fa-paper-plane send-message-btn"
              aria-hidden="true"
              onClick={handleSendClick}
            ></button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatArea;

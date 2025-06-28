import React, { useEffect } from 'react'
import './home.css'
import Header from './Components/header.jsx'
import Sidebar from './Components/Sidebar.jsx'
import ChatArea from './Components/ChatArea.jsx'
import { useSelector } from 'react-redux'
import { io } from 'socket.io-client'

const socket = io('http://localhost:5000', {
  transports: ['websocket'],
});
const Home = () => {
  const { selectedChat, user } = useSelector((state) => state.user);
  //   const socket = io('http://localhost:5000', {
  //   transports: ['websocket'],
  // });


  useEffect(() => {
  if (!user) return;

  socket.emit('join-room', user);

  // socket.emit('send-message', {
  //   recipient: '685549f0c859081e0eab01d9', // This is a user ID now
  //   msg: 'Hy Im Using React Js for Mern Stack Project.',
  // });

  // socket.on('recieve-msg', (data) => {
  //   console.log('📩 New message received:', data);
  // });

  // // Cleanup to prevent multiple bindings
  // return () => {
  //   socket.off('recieve-msg');
  // };
}, [user]);


  return (
    <div className="home-page">
      <Header />
      <div className="main-content">
        <Sidebar socket= {socket}/>
        {selectedChat && <ChatArea socket={socket} />}
      </div>
    </div>
  )
}

export default Home

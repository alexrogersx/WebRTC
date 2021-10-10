// eslint-disable-next-line no-unused-vars
import React, {createContext, useEffect, useState, useContext} from 'react';
import {useSnackbar} from 'notistack';

import {ChildrenProps, IChatContext} from '../shared/types';
import Message from '../shared/classes/Message';
import {IReceivedMessage, parseMessage} from '../util/classParser';
import {SocketIOContext} from './SocketIOContext';
import {RestContext} from './rest/RestContext';

const ChatContext = createContext<Partial<IChatContext>>({});


interface Props extends ChildrenProps {}

const ChatContextProvider : React.FC<Props> = ({children}) => {
  const {socket, meeting} = useContext(SocketIOContext);
  const {currentUser} = useContext(RestContext);
  const {enqueueSnackbar} = useSnackbar();
  //* The array of messages in the chat
  const [messageList, setMessageList] = useState<Message[]>([]);

  useEffect(() => {
    setMessageListener();
  }, [socket]);

  /* Reset message list when a new meeting is joined*/
  useEffect(() => {
    setMessageList([]);
  }, [meeting]);

  /**
     * Listens for new user message event then...
     */
  const setMessageListener = () => {
    socket?.on('ReceivedMessage', (receivedMessage:IReceivedMessage) => {
      console.log('ReceivedMessage', receivedMessage);
      const message = parseMessage(receivedMessage);
      setMessageList((prevState) => [...prevState, message]);
      if (message.user.id.toString() === currentUser?.id.toString()) {
        enqueueSnackbar(`New message from ${message.user}`);
      }
    });
    socket?.on('ExistingMessages', (receivedMessages:IReceivedMessage[]) => {
      // TODO allow for previous state to be persisted
      //  when messages are received in bulk
      console.log('ExistingMessages', receivedMessages);
      const messages = receivedMessages.map((message) => parseMessage(message));
      console.log('parsed messages', messages);
      // setMessageList((prevState) => [...prevState, ...messages]);
      setMessageList(messages);
    });
  };
  const sendMessage = (message:Message) =>{
    socket?.emit('SendMessage', message);
  };
  return (
    <ChatContext.Provider value={{messageList, sendMessage}} >
      {children}
    </ChatContext.Provider>
  );
};

ChatContext.displayName = 'Chat Context';

export {ChatContextProvider, ChatContext};

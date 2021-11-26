/* eslint-disable no-unused-vars */
import React, {
  createContext,
  useEffect,
  useState,
} from 'react';
import {OptionsObject, useSnackbar} from 'notistack';
import ObjectID from 'bson-objectid';

import {ChildrenProps} from '../../shared/types';
import User from '../../shared/classes/User.js';
import {
  IReceivedMeeting,
  parseMeeting,
  parseUser,
} from '../../util/classParser';
import Meeting from '../../shared/classes/Meeting';
import {RefreshResponse, useRestApi} from './useRestApi';
import useLocalStorageState from 'use-local-storage-state';
import {AuthenticationError} from '../../util/errors/AuthenticationError';

/** Context for making HTTP Calls */
const RestContext = createContext<IRestContext>(undefined!);

/**
 * A context provider for RestContext
 * @param {React.Children} children
 * @return {JSX.Element}
 */
const RestContextProvider = ({children}: ChildrenProps) => {
  // TODO check for cookie on refresh (persist login)
  const {enqueueSnackbar} = useSnackbar();
  /** An array of meetings that can be joined. */
  const [meetingList, setMeetingList] = useState<Meeting[]>([]);
  /** Local storage boolean that indicates whether the user has chosen
   * to log out. */
  const [loggedOut, setLoggedOut] = useLocalStorageState('logout', false);
  /** Boolean state that indicates if the meeting get request is loading */
  const [meetingsLoading, setMeetingsLoading] = useState(false);
  /** The current meeting that has been joined */
  const [meeting, setMeeting] = useState<Meeting | null>(null);

  /**
   * Handles errors that occur when making HTTP calls.
   * @param {any}error An error object.
   * @param {string} message A message to display on 401 error.
   */
  const handleError = (error:any, message?: string) => {
    const newMessage = message?? error.message?? 'An error has occurred';
    if (error?.response?.status === 401) {
      enqueueSnackbar(newMessage, snackbarWarnOptions);
    } else if (error?.response?.status >= 500) {
      console.error(error.message);
    } else console.error(error.message);
  };

  const {
    api,
    token,
    setToken,
    currentUser,
    setCurrentUser,
    refreshToken,
  } = useRestApi(null, handleError);
  /**
   * Check if a local storage event has been registered indicating that the user
   * has willfully logged out. If no event is found, attempt to
   * login via refresh token.
   * @return {Promise<void>}
   */
  const checkIfLogged = async () => {
    try {
      if (loggedOut === true) return;
      await refreshToken();
    } catch (error) {
      if (error instanceof AuthenticationError) {
        currentUser;
        console.log('Not logged in');
      } else throw error;
    }
  };

  /**
   * Communicates with the backend to login user
   * @param {ILoginCredentials} credentials and object containing the email
   * and password to login with.
   * Receives a token on successful login and stores it to react state
   * and local storage to be used throughout the application;
   * return {Promise<User | undefined>} A promise resolving to the
   * a user object reflecting the new logged in user or undefined
   * if the login was not successful.
   */
  const login = async (
      credentials: ILoginCredentials,
  ):Promise<User | undefined> => {
    const failedLoginMessage = 'Invalid Username or Password';
    try {
      const response = await api.post('/login', credentials);
      const {token: receivedToken, user} = response.data;
      setToken(receivedToken);
      const parsedUser = parseUser(user);
      setCurrentUser(parsedUser);
      enqueueSnackbar(
          `Welcome ${parsedUser.fullName}`,
          snackbarSuccessOptions,
      );
      setLoggedOut(false);
      return parsedUser;
    } catch (error) {
      handleError(error, failedLoginMessage);
    }
  };
  /**
   * Communicates with the backend to create a new user.
   * @param {INewUser} newUser An object containing the information required
   * to create a new user.
   * return {Promise<User>} A promise resolving to the
   * a User object..
   */
  const createUser = async (newUser: INewUser):Promise<User> => {
    const {firstName, lastName, email, password, iconImage} = newUser;
    const newId = new ObjectID();
    const formData = new FormData();
    formData.append('id', newId.toString());
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('email', email.toLowerCase());
    formData.append('password', password);
    formData.append('icon', iconImage?? '');
    const response = await api
        .post('users', formData)
        .catch((error) => handleError(error, 'Unable to create user'));
    const user = response?.data;
    const parsedUser = parseUser(user);
    enqueueSnackbar(
        `Account for ${parsedUser.email} created`,
        snackbarSuccessOptions,
    );
    return parsedUser;
  };
  /**
   * Communicates with the backend to create a new meeting.
   * @param {INewMeeting} newMeeting An object containing the information
   * required to create a new meeting.
   * return {Promise<Meeting | undefined>} A promise resolving to the
   * a meeting object reflecting the new created meeting or undefined
   * if the creation was not successful.
   */
  const createMeeting = async (
      newMeeting: INewMeeting,
  ):Promise<Meeting | undefined> => {
    const {title, description, start, end, iconImage} = newMeeting;
    const newMeetingId = new ObjectID();
    const formData = new FormData();
    formData.append('id', newMeetingId.toString());
    formData.append('title', title);
    formData.append('description', description);
    formData.append('start', start.toString());
    formData.append('end', end.toString());
    formData.append('icon', iconImage?? '');
    const response = await api
        .post('meetings', formData )
        .catch((error) => {
          handleError(error, 'Unable to create meeting');
        });
    if (!response) return;
    const parsedMeeting = parseMeeting(response.data);
    setMeetingList((oldState) => [...oldState, parsedMeeting]);
    enqueueSnackbar(
        `Meeting titled \"${parsedMeeting?.title}\" was created`,
        snackbarSuccessOptions);
    return parsedMeeting;
  };
  /**
   * Logs the user out
   * Removes the stored token from react state and from local storage.
   * Sets the current user to null.
   */
  const logout = async () => {
    setToken(null);
    setCurrentUser(null);
    setLoggedOut(true);
    try {
      await api.get('/login/logout');
    } catch (error) {
      handleError(error, 'Error when logging out');
      throw error;
    }
  };
  /**
   * Populate meetings on refresh
   */
  useEffect(() => {
    if (!token) return;
    void getMeetings();
  }, [token]);

  /**
   * Populates the meetingList state
   */
  const getMeetings = async () => {
    try {
      setMeetingsLoading(true);
      const response = await api.get('/meetings/');
      const parsedMeetings = response.data.map(
          (item:IReceivedMeeting) => parseMeeting(item),
      );
      setMeetingsLoading(false);
      setMeetingList(parsedMeetings);
    } catch (error) {
      handleError(error);
      console.log(error);
    }
  };
  /**
   * Looks up a meeting from its id
   * @param {string} id The id of the meeting to look up
   * @return {Promise<Meeting | undefined>} a promise resolving to the
   * meeting if successful.
   */
  const findMeeting = async (id:string) : Promise<Meeting | undefined> => {
    const response = await api.get(`/meetings/${id}`);
    return parseMeeting(response?.data);
  };
  /**
   * Deletes a meeting
   * @param {string} id the id of the meeting to delete
   * @return {Promise<boolean>} a promise resolving to true if successful.
   */
  const deleteMeeting = async (id:string) => {
    try {
      await api.delete(`/meetings/${id}`);
      removeMeetingFromList(id, false);
      enqueueSnackbar(`Meeting Deleted`, snackbarInfoOptions);
      return true;
    } catch (error) {
      handleError(error);
      console.log(error);
      return false;
    }
  };
  /**
   * Adds the provided meeting to the meeting list and updates state
   * @param {Meeting} addedMeeting The meeting to add
   * @param {boolean } notify Whether or not a notification should appear
   * indicating the change. Defaults to true.
   */
  const addMeetingToList = (addedMeeting:Meeting, notify =true) => {
    setMeetingList((oldState) => {
      /* Guard against duplicates*/
      const meetingFound = oldState.find((meeting) =>
        addedMeeting.id.toHexString() === meeting.id.toHexString());
      if (meetingFound) {
        return oldState;
      }
      notify && enqueueSnackbar(
          `New meeting titled \"${addedMeeting?.title}\" available`,
          snackbarInfoOptions);
      return [...oldState, addedMeeting];
    });
  };
  /**
   * Removes the provided meeting from meeting list and updates state
   * @param {String} id The id of the meeting to remove
   * @param {boolean } notify Whether or not a notification should appear
   * indicating the change. Defaults to true.
   */
  const removeMeetingFromList = (id:string, notify =true) => {
    setMeetingList((oldState) => {
      const meetingIndex = oldState.findIndex((meeting) =>
        id === meeting.id.toHexString());
      if (meetingIndex > -1) {
        notify && enqueueSnackbar(
            `Meeting titled \"${oldState[meetingIndex].title}\" 
            no long available`, snackbarInfoOptions);
        const newState= [...oldState];
        newState.splice(meetingIndex, 1);
        return newState;
      }
      return oldState;
    });
  };

  return (
    <RestContext.Provider
      value={{
        login,
        logout,
        loggedOut,
        refreshToken,
        checkIfLogged,
        currentUser,
        createUser,
        createMeeting,
        findMeeting,
        meetingList,
        token,
        deleteMeeting,
        addMeetingToList,
        removeMeetingFromList,
        meetingsLoading,
        meeting,
        setMeeting,
      }}
    >
      {children}
    </RestContext.Provider>
  );
};
export interface IRestContext {
  login: (credentials: ILoginCredentials) => Promise<User| undefined>,
  logout: () => Promise<void>,
  loggedOut: boolean,
  refreshToken: () => Promise<RefreshResponse>,
  createUser: (newUser: INewUser) => Promise<User| undefined>,
  createMeeting: (newMeeting: INewMeeting) => Promise<Meeting | undefined>
  meetingList: Meeting[]
  currentUser: User | null,
  findMeeting: (id:string) => Promise<Meeting | undefined>
  token: string | null,
  checkIfLogged: () => Promise<void>,
  deleteMeeting: (id:string) => Promise<boolean>;
  addMeetingToList: (meeting:Meeting) => void;
  removeMeetingFromList: (id:string) => void;
  meetingsLoading: boolean;
  meeting:Meeting | null;
  setMeeting: (meeting:Meeting| null) => void;
}

const snackbarSuccessOptions: OptionsObject = {
  variant: 'success',
  autoHideDuration: 2000,
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'center',
  },
};

const snackbarWarnOptions :OptionsObject = {
  variant: 'warning',
  autoHideDuration: 2000,
  anchorOrigin: {
    vertical: 'top',
    horizontal: 'center',
  },
};
const snackbarInfoOptions :OptionsObject = {
  variant: 'info',
  autoHideDuration: 2000,
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'left',
  },
};

export interface ILoginCredentials {
  email: string,
  password: string
}
export interface INewUser {
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  iconImage?: string,

}
export interface INewMeeting {
  title: string,
  description: string,
  start: Date,
  end: Date,
  iconImage?: string,
  attendees?: User[],
}


RestContext.displayName = 'Rest Context';


export {RestContextProvider, RestContext};

import React, {RefAttributes, useState} from 'react';
import {makeStyles, createStyles} from '@material-ui/core/styles';

import ModalWrapper from '../common/ModalWrapper';
import LoginForm from '../forms/LoginForm';
import JoinMeetingForm from '../forms/JoinMeetingForm';
import NewUserForm from '../forms/NewUserForm';
import NewMeetingForm from '../forms/NewMeetingForm';
import RenderTutorial from '../tutorial/RenderTutorial';
import MenuDrawer from './MenuDrawer';
import {FormProps} from '../../util/types';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      alignContent: 'flex-end',
      width: '100%',
    },
  }),
);
/**
 * The main menu component which contains the elements that create the apps
 * menu functionality.
 * TODO add to docs
 * @return {JSX.Element}
 * @function
 */
export const Menu = () => {
  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [joinMeetingModalOpen, setJoinMeetingModal] = useState(false);
  const [createAccountModalOpen, setCreateAccountModalOpen] = useState(false);
  const [createMeetingModalOpen, setCreateMeetingModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  return (
    <div className={classes.root}>
      <MenuDrawer
        {...{
          setJoinMeetingModal,
          setCreateAccountModalOpen,
          setCreateMeetingModalOpen,
          setLoginModalOpen,
          setDrawerOpen,
          drawerOpen,
        }}
      />
      <ModalWrapper<FormProps, RefAttributes<HTMLDivElement>>
        WrappedComponent={JoinMeetingForm}
        componentProps={{
          setOpen: setJoinMeetingModal,
        }}
        modalOpen={joinMeetingModalOpen}
        setModalOpen={setJoinMeetingModal}
      />
      <ModalWrapper<FormProps, RefAttributes<HTMLDivElement>>
        modalOpen={loginModalOpen}
        setModalOpen={setLoginModalOpen}
        WrappedComponent={LoginForm}
        componentProps={{
          setOpen: setLoginModalOpen,
        }}
      />
      <ModalWrapper<FormProps, RefAttributes<HTMLDivElement>>
        modalOpen={createAccountModalOpen}
        setModalOpen={setCreateAccountModalOpen}
        WrappedComponent={NewUserForm}
        componentProps={{
          setOpen: setCreateAccountModalOpen,
        }}
      />
      <ModalWrapper<FormProps, RefAttributes<HTMLDivElement>>
        modalOpen={createMeetingModalOpen}
        setModalOpen={setCreateMeetingModalOpen}
        WrappedComponent={NewMeetingForm}
        componentProps={{
          setOpen: setCreateMeetingModalOpen,
        }}
      />
      <RenderTutorial
        {...{
          drawerOpen,
          createAccountModalOpen,
          loginModalOpen,
          createMeetingModalOpen,
          joinMeetingModalOpen,
        }}
      />
    </div>
  );
};
export default Menu;

export interface MenuStateProps {
    setJoinMeetingModal: React.Dispatch<React.SetStateAction<boolean>>
    setCreateAccountModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    setCreateMeetingModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    setLoginModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

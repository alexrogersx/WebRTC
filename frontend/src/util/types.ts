/* eslint-disable no-unused-vars */
import React from 'react';
import Peer, {MediaConnection} from 'peerjs';
import User from '@webrtc/backend/dist/shared/classes/User';

export interface ChildrenProps {
   children?: JSX.Element;
}
export interface MultipleChildrenProps {
   children?: JSX.Element| JSX.Element[];
}
export interface ChildrenPropsMandatory {
   children: JSX.Element;
}

export interface IMeetingData {
   userID: string,
   roomID: string,
}

export interface IExternalMedia {
   user: User,
   stream: MediaStream,
   data?: any,

}

export interface IPeers {
   [key: string]: MediaConnection
 }

export interface FormProps {
    setOpen: (open: boolean) => void
 }


export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
    Pick<T, Exclude<keyof T, Keys>>
    & {
   [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
}[Keys]

export type RequireOnlyOne<T, Keys extends keyof T = keyof T> =
    Pick<T, Exclude<keyof T, Keys>>
    & {
   [K in Keys]-?:
    Required<Pick<T, K>>
    & Partial<Record<Exclude<Keys, K>, undefined>>
}[Keys]


export interface ICallMetadata {
   user: User
}


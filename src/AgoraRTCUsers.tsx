import React, { Fragment, useEffect } from 'react'

import {
  atom,
  selectorFamily,
  useRecoilCallback,
  useResetRecoilState
} from 'recoil'
import { IAgoraRTCRemoteUser, UID } from 'agora-rtc-sdk-ng'

import { useAgoraRTCEvent } from './hooks/useAgoraRTCEvent'
import { useAgoraRTCConnectionState } from './hooks/useAgoraRTCConnectionState'

export type AgoraRTCUser = IAgoraRTCRemoteUser

export const usersState = atom<AgoraRTCUser[]>({
  key: 'users',
  default: [],
  dangerouslyAllowMutability: true
})

export const remoteUsersState = selectorFamily<AgoraRTCUser[], UID | undefined>(
  {
    key: 'remote-users',
    get:
      (uid) =>
      ({ get }) =>
        get(usersState).filter((u) => u.uid !== uid),
    dangerouslyAllowMutability: true
  }
)

export const AgoraRTCUsers: React.FC<React.PropsWithChildren<unknown>> = ({
  children
}) => {
  useAgoraRTCEvent(
    'user-joined',
    useRecoilCallback(
      ({ set }) =>
        (user: IAgoraRTCRemoteUser) => {
          set(usersState, (prev) => {
            console.warn('user-joined', prev)
            return [...prev, user]
          })
        },
      []
    )
  )

  useAgoraRTCEvent(
    'user-left',
    useRecoilCallback(
      ({ set }) =>
        (user: IAgoraRTCRemoteUser, _: string) => {
          set(usersState, (prev) => {
            console.warn('user-left', prev)
            return prev.filter((u) => u.uid !== user.uid)
          })
        },
      []
    )
  )

  useAgoraRTCEvent(
    'user-published',
    useRecoilCallback(
      ({ set }) =>
        async (user: IAgoraRTCRemoteUser, _: 'audio' | 'video') => {
          set(usersState, (prev) => {
            console.warn('user-published', prev)
            return [...prev.filter((u) => u.uid !== user.uid), user]
          })
        },
      []
    )
  )

  useAgoraRTCEvent(
    'user-unpublished',
    useRecoilCallback(
      ({ set }) =>
        async (user: IAgoraRTCRemoteUser, _: 'audio' | 'video') => {
          set(usersState, (prev) => {
            console.warn('user-unpublished', prev)
            return [...prev.filter((u) => u.uid !== user.uid), user]
          })
        },
      []
    )
  )

  const [connectionState] = useAgoraRTCConnectionState()
  const resetUsersState = useResetRecoilState(usersState)
  useEffect(() => {
    if (connectionState.curState === 'DISCONNECTED') {
      resetUsersState()
    }
  }, [connectionState])

  return <Fragment>{children}</Fragment>
}

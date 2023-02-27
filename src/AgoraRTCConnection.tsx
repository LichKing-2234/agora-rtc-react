import React, { Fragment } from 'react'

import { atom, useRecoilCallback } from 'recoil'
import { ConnectionDisconnectedReason, ConnectionState } from 'agora-rtc-sdk-ng'

import { useAgoraRTCEvent } from './hooks/useAgoraRTCEvent'

export interface AgoraRTCConnectionState {
  curState: ConnectionState
  revState: ConnectionState
  reason?: ConnectionDisconnectedReason
}

export const connectionState = atom<AgoraRTCConnectionState>({
  key: 'connection-state',
  default: {
    curState: 'DISCONNECTED',
    revState: 'DISCONNECTED',
    reason: undefined
  }
})

export const AgoraRTCConnection: React.FC<React.PropsWithChildren<unknown>> = ({
  children
}) => {
  useAgoraRTCEvent(
    'connection-state-change',
    useRecoilCallback(
      ({ set }) =>
        (
          curState: ConnectionState,
          revState: ConnectionState,
          reason?: ConnectionDisconnectedReason
        ) => {
          set(connectionState, { curState, revState, reason })
        },
      []
    )
  )

  return <Fragment>{children}</Fragment>
}

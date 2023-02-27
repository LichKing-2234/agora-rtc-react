import { useContext } from 'react'

import { IAgoraRTCClient } from 'agora-rtc-sdk-ng'

import { AgoraRTCContext } from '../AgoraRTCContext'

export const useAgoraRTCClient = (): [IAgoraRTCClient | undefined] => [useContext(AgoraRTCContext)]

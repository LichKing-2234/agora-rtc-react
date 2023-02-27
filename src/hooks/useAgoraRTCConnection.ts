import { useContext, useEffect } from "react"

import { UID } from 'agora-rtc-sdk-ng'

import { AgoraRTCConnectionState } from "../AgoraRTCConnection"
import { AgoraRTCContext } from '../AgoraRTCContext'
import { useAgoraRTCConnectionState } from './useAgoraRTCConnectionState'

export type AgoraRTCConnectionConfig = {
    appid: string
    channel: string
    token: string | null
    uid?: UID | null
}

export const useAgoraRTCConnection = ({ appid, channel, token, uid }: AgoraRTCConnectionConfig): [AgoraRTCConnectionState] => {
    const client = useContext(AgoraRTCContext)
    const [state] = useAgoraRTCConnectionState()
    useEffect(() => {
        if (!appid || !channel) return
        console.warn('join', appid, channel, token, uid)
        if (state.curState === 'CONNECTED') {
            client?.leave()
        }
        client?.join(appid, channel, token, uid)
        return () => {
            client?.leave()
        }
    }, [appid, channel, token, uid])
    return [state]
}

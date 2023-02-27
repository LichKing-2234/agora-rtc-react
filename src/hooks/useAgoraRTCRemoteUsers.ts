import { useRecoilValue } from "recoil"

import { IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng'

import { remoteUsersState } from "../AgoraRTCUsers"
import { useAgoraRTCClient } from "./useAgoraRTCClient"

export const useAgoraRTCRemoteUsers = (): [IAgoraRTCRemoteUser[]] => {
    const [client] = useAgoraRTCClient();
    return [useRecoilValue(remoteUsersState(client?.uid))]
}

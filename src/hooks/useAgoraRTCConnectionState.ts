import { useRecoilValue } from "recoil"

import { AgoraRTCConnectionState, connectionState } from "../AgoraRTCConnection"

export const useAgoraRTCConnectionState = (): [AgoraRTCConnectionState] => [useRecoilValue(connectionState)]

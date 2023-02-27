import { useRecoilValue } from "recoil"

import { devicesState } from "../AgoraRTCDevices"

export const useAgoraRTCDevices = (kind: MediaDeviceKind): [MediaDeviceInfo[]] => [useRecoilValue(devicesState(kind))]

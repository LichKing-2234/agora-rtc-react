import { useRecoilValue } from "recoil"

import { allDevicesState, devicesState } from "../AgoraRTCDevices"

export const useAgoraRTCDevices = (kind?: MediaDeviceKind): [MediaDeviceInfo[]] =>
    [useRecoilValue(kind === undefined ? allDevicesState : devicesState(kind))]

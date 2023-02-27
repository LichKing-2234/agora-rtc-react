import React, { Fragment, useEffect } from 'react'

import { atom, selectorFamily, useRecoilCallback } from 'recoil'
import AgoraRTC, { DeviceInfo } from 'agora-rtc-sdk-ng'

export const allDevicesState = atom<MediaDeviceInfo[]>({
  key: 'all-devices',
  default: []
})

export const devicesState = selectorFamily<MediaDeviceInfo[], MediaDeviceKind>({
  key: 'devices',
  get:
    (kind) =>
    ({ get }) =>
      get(allDevicesState).filter((d) => d.kind === kind)
})

export const AgoraRTCDevices: React.FC<React.PropsWithChildren<unknown>> = ({
  children
}) => {
  const initDevices = useRecoilCallback(
    ({ set }) =>
      (devices: MediaDeviceInfo[]) => {
        console.warn('initDevices', devices)
        set(allDevicesState, devices)
      },
    []
  )

  useEffect(() => {
    AgoraRTC.getDevices().then(initDevices)
  }, [])

  const onDeviceChanged = useRecoilCallback(
    ({ set }) =>
      (deviceInfo: DeviceInfo) => {
        console.warn('onDeviceChanged', deviceInfo)
        if (deviceInfo.state === 'ACTIVE') {
          set(allDevicesState, (prev) => [
            ...prev.filter((d) => d.deviceId !== deviceInfo.device.deviceId),
            deviceInfo.device
          ])
        } else if (deviceInfo.state === 'INACTIVE') {
          set(allDevicesState, (prev) => [
            ...prev.filter((d) => d.deviceId !== deviceInfo.device.deviceId)
          ])
        }
      },
    []
  )

  useEffect(() => {
    AgoraRTC.onCameraChanged = onDeviceChanged
    AgoraRTC.onMicrophoneChanged = onDeviceChanged
    AgoraRTC.onPlaybackDeviceChanged = onDeviceChanged
    return () => {
      AgoraRTC.onCameraChanged = undefined
      AgoraRTC.onMicrophoneChanged = undefined
      AgoraRTC.onPlaybackDeviceChanged = undefined
    }
  }, [])

  return <Fragment>{children}</Fragment>
}

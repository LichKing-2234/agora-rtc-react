import * as React from 'react'
import {
  useAgoraRTCConnection,
  AgoraVideo,
  useAgoraRTCSubscribeConfigs,
  AgoraAudio,
  SubscribeConfig,
  useAgoraRTCDevices,
  useAgoraRTCLocalTracks
} from 'agora-rtc-react'
import styles from '../styles.module.css'
import { ILocalVideoTrack } from 'agora-rtc-sdk-ng'

interface Props {}

export const Camera = ({}: Props) => {
  const [channel, setChannel] = React.useState('')
  const [mirror, setMirror] = React.useState(false)

  const [subscribeConfigs] = useAgoraRTCSubscribeConfigs(true)
  const [devices1] = useAgoraRTCDevices('videoinput')
  const [devices2] = useAgoraRTCDevices('audioinput')
  const [devices3] = useAgoraRTCDevices('audiooutput')

  const [state] = useAgoraRTCConnection({
    appid: APPID,
    channel: channel,
    token: null
  })

  const [localTracks, { createCameraVideoTrack }] = useAgoraRTCLocalTracks(true)
  React.useEffect(() => {
    createCameraVideoTrack()
  }, [])

  const handleDivClick = React.useCallback(() => {
    setChannel('456')
  }, [])
  const handleVideoClick = React.useCallback(() => {
    setMirror(!mirror)
  }, [mirror])

  return (
    <div>
      <div className={styles.test} onClick={handleDivClick}>
        Channel {channel}: {state.curState}
      </div>
      {devices1.map((d) => (
        <div>{`${d.label}: ${d.deviceId}`}</div>
      ))}
      {devices2.map((d) => (
        <div>{`${d.label}: ${d.deviceId}`}</div>
      ))}
      {devices3.map((d) => (
        <div>{`${d.label}: ${d.deviceId}`}</div>
      ))}
      <AgoraVideo
        style={{ width: 640, height: 480 }}
        track={localTracks.at(0) as ILocalVideoTrack}
        mirror={mirror}
        fit={'contain'}
        onClick={handleVideoClick}
      />
      {subscribeConfigs.map((v: SubscribeConfig) => {
        return v.mediaType === 'video' ? (
          <AgoraVideo
            key={v.user.uid}
            style={{ width: 640, height: 480 }}
            track={v.user.videoTrack}
            mirror={mirror}
            fit={'contain'}
            onClick={handleVideoClick}
          />
        ) : (
          <AgoraAudio track={v.user.audioTrack} />
        )
      })}
    </div>
  )
}

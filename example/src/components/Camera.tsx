import * as React from 'react'

import { ILocalVideoTrack } from 'agora-rtc-sdk-ng'
import {
  useAgoraRTCConnection,
  AgoraVideo,
  useAgoraRTCSubscribeConfigs,
  AgoraAudio,
  SubscribeConfig,
  useAgoraRTCLocalTracks
} from 'agora-rtc-react'

import styles from '../styles.module.css'

interface Props {}

export const Camera = ({}: Props) => {
  const [subscribeConfigs] = useAgoraRTCSubscribeConfigs(true)

  const [state] = useAgoraRTCConnection({
    appid: APPID,
    channel: '456',
    token: null
  })

  const [localTracks, { createMicrophoneAudioTrack, createCameraVideoTrack }] =
    useAgoraRTCLocalTracks(true)
  React.useEffect(() => {
    createMicrophoneAudioTrack()
    createCameraVideoTrack()
  }, [])

  return (
    <div>
      <div className={styles.test}>{`${state.curState}`}</div>
      {localTracks.map((t) => {
        return t.processorDestination.kind === 'video' ? (
          <AgoraVideo
            key={t.getTrackId()}
            style={{ width: 640, height: 480 }}
            track={t as ILocalVideoTrack}
            mirror={false}
            fit={'contain'}
          />
        ) : undefined
      })}
      {subscribeConfigs.map((v: SubscribeConfig) => {
        return v.mediaType === 'video' ? (
          <AgoraVideo
            key={v.user.uid}
            style={{ width: 640, height: 480 }}
            track={v.user.videoTrack}
            mirror={false}
            fit={'contain'}
          />
        ) : (
          <AgoraAudio track={v.user.audioTrack} />
        )
      })}
    </div>
  )
}

import * as React from 'react'
import {
  useAgoraRTCConnection,
  AgoraVideo,
  useAgoraRTCSubscribeConfigs,
  AgoraAudio,
  SubscribeConfig,
  useAgoraRTCLocalTracks,
  useAgoraRTCClient
} from 'agora-rtc-react'
import { ILocalVideoTrack } from 'agora-rtc-sdk-ng'

import styles from '../styles.module.css'

interface Props {}

export const Camera = ({}: Props) => {
  const [client] = useAgoraRTCClient()
  const [subscribeConfigs] = useAgoraRTCSubscribeConfigs(true)

  const [state] = useAgoraRTCConnection({
    appid: APPID,
    channel: '456',
    token: null
  })

  const [localTracks, { createCameraVideoTrack }] = useAgoraRTCLocalTracks(true)
  React.useEffect(() => {
    createCameraVideoTrack()
  }, [])

  return (
    <div>
      <div className={styles.test}>{`${client?.uid} - ${state.curState}`}</div>
      <AgoraVideo
        style={{ width: 640, height: 480 }}
        track={localTracks.at(0) as ILocalVideoTrack}
        mirror={false}
        fit={'contain'}
      />
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

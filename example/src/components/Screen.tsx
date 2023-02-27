import * as React from 'react'

import { ILocalVideoTrack } from 'agora-rtc-sdk-ng'
import {
  useAgoraRTCConnection,
  AgoraVideo,
  useAgoraRTCLocalTracks
} from 'agora-rtc-react'

import styles from '../styles.module.css'

interface Props {}

export const Screen = ({}: Props) => {
  const [state] = useAgoraRTCConnection({
    appid: APPID,
    channel: '456',
    token: null
  })

  const [localTracks, { createScreenVideoTrack }] = useAgoraRTCLocalTracks(true)
  React.useEffect(() => {
    createScreenVideoTrack()
  }, [])

  return (
    <div>
      <div className={styles.test}>{state.curState}</div>
      <AgoraVideo
        style={{ width: 1280, height: 720 }}
        track={localTracks.at(0) as ILocalVideoTrack}
        mirror={false}
        fit={'contain'}
      />
    </div>
  )
}

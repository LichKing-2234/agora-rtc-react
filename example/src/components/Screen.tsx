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
  const [channel, setChannel] = React.useState('')
  const [mirror, setMirror] = React.useState(false)

  const [state] = useAgoraRTCConnection({
    appid: APPID,
    channel: channel,
    token: null
  })

  const [localTracks, { createScreenVideoTrack }] = useAgoraRTCLocalTracks(true)
  React.useEffect(() => {
    createScreenVideoTrack()
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
      <AgoraVideo
        style={{ width: 1280, height: 720 }}
        track={localTracks.at(0) as ILocalVideoTrack}
        mirror={mirror}
        fit={'contain'}
        onClick={handleVideoClick}
      />
    </div>
  )
}

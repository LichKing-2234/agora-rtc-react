import React, { Fragment, useEffect } from 'react'

import {
  ILocalAudioTrack,
  IMicrophoneAudioTrack,
  IRemoteAudioTrack
} from 'agora-rtc-sdk-ng'

type BaseProps =
  | React.HTMLAttributes<HTMLDivElement> & {
      track?: ILocalAudioTrack | IRemoteAudioTrack | IMicrophoneAudioTrack
    }

type Props = BaseProps

export const AgoraAudio: React.FC<React.PropsWithChildren<Props>> = ({
  track,
  children,
  ...props
}) => {
  useEffect(() => {
    if (track?.isPlaying) {
      return
    }
    track?.play()
    return () => {
      track?.stop()
    }
  }, [track])

  return <Fragment {...props}>{children}</Fragment>
}

import React, { useRef, forwardRef, useEffect, memo } from 'react'

import {
  ICameraVideoTrack,
  ILocalVideoTrack,
  IRemoteVideoTrack,
  VideoPlayerConfig
} from 'agora-rtc-sdk-ng'

import useMergedRef from '../hooks/useMergedRef'

type BaseProps =
  | React.HTMLAttributes<HTMLDivElement> & {
      track?: ILocalVideoTrack | IRemoteVideoTrack | ICameraVideoTrack
    }

type Props = BaseProps & VideoPlayerConfig

export const AgoraVideo = memo(
  forwardRef<HTMLDivElement, Props>(
    ({ track, mirror, fit, ...others }, ref) => {
      const videoEl = useRef<HTMLDivElement>(null)
      const videoRef = useMergedRef<HTMLDivElement>(videoEl, ref)

      useEffect(() => {
        if (!videoEl.current) return
        if (track?.isPlaying) {
          track.stop()
        }
        track?.play(videoEl.current, { mirror, fit })
        return () => {
          track?.stop()
        }
      }, [track, mirror, fit])

      return <div ref={videoRef} {...others} />
    }
  )
)

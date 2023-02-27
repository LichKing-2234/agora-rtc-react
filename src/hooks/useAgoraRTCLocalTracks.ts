import { useContext, useEffect } from 'react'

import { atom, useRecoilCallback, useRecoilValue } from 'recoil'
import AgoraRTC, { BufferSourceAudioTrackInitConfig, CameraVideoTrackInitConfig, CustomAudioTrackInitConfig, CustomVideoTrackInitConfig, ILocalAudioTrack, ILocalVideoTrack, MicrophoneAudioTrackInitConfig, ScreenVideoTrackInitConfig } from 'agora-rtc-sdk-ng'

import { AgoraRTCContext } from '../AgoraRTCContext'
import { useAgoraRTCConnectionState } from './useAgoraRTCConnectionState'

export type AgoraRTCLocalTrack = ILocalAudioTrack | ILocalVideoTrack

export const localTracksState = atom<AgoraRTCLocalTrack[]>({
    key: 'local-tracks',
    default: [],
    dangerouslyAllowMutability: true
})

export const useAgoraRTCLocalTracks = (autoPublish: true): [AgoraRTCLocalTrack[], any] => {
    const client = useContext(AgoraRTCContext)
    const [connectionState] = useAgoraRTCConnectionState()
    const localTracks = useRecoilValue(localTracksState)

    useEffect(() => {
        console.warn('useAgoraRTCLocalTracks', localTracks)
        if (autoPublish && connectionState.curState === 'CONNECTED') {
            if (localTracks.length > 0) {
                client?.publish(localTracks)
            }
        }
        return () => {
            client?.unpublish(localTracks).catch(console.warn)
        }
    }, [autoPublish, client, connectionState, localTracks])

    const createMicrophoneAudioTrack = useRecoilCallback(({ set }) => async (config?: MicrophoneAudioTrackInitConfig) => {
        const track = await AgoraRTC.createMicrophoneAudioTrack(config)
        track.on('track-ended', () => {

        })
        set(localTracksState, (prev) => [...prev, track])
        return track
    }, [client, connectionState])

    const createCameraVideoTrack = useRecoilCallback(({ set }) => async (config?: CameraVideoTrackInitConfig) => {
        const track = await AgoraRTC.createCameraVideoTrack(config)
        track.on('track-ended', () => {

        })
        set(localTracksState, (prev) => [...prev, track])
        return track
    }, [client, connectionState])

    const createScreenVideoTrack = useRecoilCallback(({ set }) => async (config: ScreenVideoTrackInitConfig) => {
        const videoTrack = await AgoraRTC.createScreenVideoTrack(config, 'disable')
        videoTrack.on('track-ended', () => {

        })
        // audioTrack.on('track-ended', () => {

        // })
        set(localTracksState, (prev) => [...prev, videoTrack])
        return videoTrack
    }, [client, connectionState])

    const createBufferSourceAudioTrack = useRecoilCallback(({ set }) => async (config: BufferSourceAudioTrackInitConfig) => {
        const track = await AgoraRTC.createBufferSourceAudioTrack(config)
        track.on('track-ended', () => {

        })
        set(localTracksState, (prev) => [...prev, track])
        return track
    }, [client, connectionState])

    const createCustomAudioTrack = useRecoilCallback(({ set }) => async (config: CustomAudioTrackInitConfig) => {
        const track = AgoraRTC.createCustomAudioTrack(config)
        track.on('track-ended', () => {

        })
        set(localTracksState, (prev) => [...prev, track])
        return track
    }, [client, connectionState])

    const createCustomVideoTrack = useRecoilCallback(({ set }) => async (config: CustomVideoTrackInitConfig) => {
        const track = AgoraRTC.createCustomVideoTrack(config)
        track.on('track-ended', () => {

        })
        set(localTracksState, (prev) => [...prev, track])
        return track
    }, [client, connectionState])

    return [localTracks, {
        createMicrophoneAudioTrack,
        createCameraVideoTrack,
        createScreenVideoTrack,
        createBufferSourceAudioTrack,
        createCustomAudioTrack,
        createCustomVideoTrack
    }]
}

import { useContext } from 'react'

import { atom, useRecoilCallback, useRecoilValue } from 'recoil'
import AgoraRTC, { BufferSourceAudioTrackInitConfig, CameraVideoTrackInitConfig, CustomAudioTrackInitConfig, CustomVideoTrackInitConfig, ILocalTrack, MicrophoneAudioTrackInitConfig, ScreenVideoTrackInitConfig } from 'agora-rtc-sdk-ng'

import { AgoraRTCContext } from '../AgoraRTCContext'
import { useAgoraRTCConnectionState } from './useAgoraRTCConnectionState'

export const localTracksState = atom<ILocalTrack[]>({
    key: 'local-tracks',
    default: [],
    dangerouslyAllowMutability: true
})

export const useAgoraRTCLocalTracks = (autoPublish: true): [ILocalTrack[], any] => {
    const client = useContext(AgoraRTCContext)
    const [connectionState] = useAgoraRTCConnectionState()
    const localTracks = useRecoilValue(localTracksState)

    const createMicrophoneAudioTrack = useRecoilCallback(({ set }) => async (config?: MicrophoneAudioTrackInitConfig) => {
        const track = await AgoraRTC.createMicrophoneAudioTrack(config)
        track.on('track-ended', () => {

        })
        set(localTracksState, (prev) => [...prev, track])
        if (autoPublish && connectionState.curState === 'CONNECTED') {
            await client?.publish(track)
        }
        return track
    }, [client, connectionState])

    const createCameraVideoTrack = useRecoilCallback(({ set }) => async (config?: CameraVideoTrackInitConfig) => {
        const track = await AgoraRTC.createCameraVideoTrack(config)
        track.on('track-ended', () => {

        })
        set(localTracksState, (prev) => [...prev, track])
        console.warn('test1')
        if (autoPublish && connectionState.curState === 'CONNECTED') {
            console.warn('test2')
            await client?.publish(track)
        }
        return track
    }, [client, connectionState])

    const createScreenVideoTrack = useRecoilCallback(({ set }) => async (config: ScreenVideoTrackInitConfig) => {
        const videoTrack = await AgoraRTC.createScreenVideoTrack(config, 'disable')
        videoTrack.on('track-ended', () => {

        })
        // audioTrack.on('track-ended', () => {

        // })
        set(localTracksState, (prev) => [...prev, videoTrack])
        if (autoPublish && connectionState.curState === 'CONNECTED') {
            await client?.publish([videoTrack])
        }
        return videoTrack
    }, [client, connectionState])

    const createBufferSourceAudioTrack = useRecoilCallback(({ set }) => async (config: BufferSourceAudioTrackInitConfig) => {
        const track = await AgoraRTC.createBufferSourceAudioTrack(config)
        track.on('track-ended', () => {

        })
        set(localTracksState, (prev) => [...prev, track])
        if (autoPublish && connectionState.curState === 'CONNECTED') {
            await client?.publish(track)
        }
        return track
    }, [client, connectionState])

    const createCustomAudioTrack = useRecoilCallback(({ set }) => async (config: CustomAudioTrackInitConfig) => {
        const track = AgoraRTC.createCustomAudioTrack(config)
        track.on('track-ended', () => {

        })
        set(localTracksState, (prev) => [...prev, track])
        if (autoPublish && connectionState.curState === 'CONNECTED') {
            await client?.publish(track)
        }
        return track
    }, [client, connectionState])

    const createCustomVideoTrack = useRecoilCallback(({ set }) => async (config: CustomVideoTrackInitConfig) => {
        const track = AgoraRTC.createCustomVideoTrack(config)
        track.on('track-ended', () => {

        })
        set(localTracksState, (prev) => [...prev, track])
        if (autoPublish && connectionState.curState === 'CONNECTED') {
            await client?.publish(track)
        }
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

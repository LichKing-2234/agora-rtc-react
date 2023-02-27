import { useEffect } from "react"

import { atomFamily, selector, useRecoilValue, useRecoilCallback } from "recoil";
import { IAgoraRTCRemoteUser, UID } from "agora-rtc-sdk-ng";

import { useAgoraRTCClient } from './useAgoraRTCClient'
import { usersState } from '../AgoraRTCUsers'
import { useAgoraRTCRemoteUsers } from "./useAgoraRTCRemoteUsers";

export type MediaType = 'audio' | 'video'

export type SubscribeConfig = {
    user: IAgoraRTCRemoteUser
    mediaType: MediaType
}

export const subscribeConfigState = atomFamily<MediaType[], UID>({
    key: 'subscribe-config',
    default: [],
})

export const subscribeConfigsState = selector<SubscribeConfig[]>({
    key: 'subscribe-configs',
    get: ({ get }) => {
        return get(usersState).flatMap((u) => {
            return get(subscribeConfigState(u.uid)).map((t) => {
                return {
                    user: u,
                    mediaType: t
                }
            })
        })
    },
    dangerouslyAllowMutability: true
})

export const useAgoraRTCSubscribeConfigs = (autoSubscribe: true): [SubscribeConfig[], (user: IAgoraRTCRemoteUser) => {}, (user: IAgoraRTCRemoteUser) => {}] => {
    const [client] = useAgoraRTCClient()
    const [remoteUsers] = useAgoraRTCRemoteUsers()
    const subscribeConfigs = useRecoilValue(subscribeConfigsState)

    const subscribe = useRecoilCallback(({ set }) => async (user: IAgoraRTCRemoteUser) => {
        console.warn('subscribe', user)
        if (user?.hasAudio) {
            await client?.subscribe(user, 'audio')
            set(subscribeConfigState(user.uid), (prev) => [...prev.filter((v) => v !== 'audio'), 'audio' as MediaType])
        }
        if (user?.hasVideo) {
            await client?.subscribe(user, 'video')
            set(subscribeConfigState(user.uid), (prev) => [...prev.filter((v) => v !== 'video'), 'video' as MediaType])
        }
    }, [client])

    const unsubscribe = useRecoilCallback(({ reset }) => async (user: IAgoraRTCRemoteUser) => {
        console.warn('unsubscribe', user)
        await client?.unsubscribe(user)
        reset(subscribeConfigState(user.uid))
    }, [client])

    useEffect(() => {
        if (autoSubscribe) {
            remoteUsers.forEach(subscribe)
        }
        return () => {
            remoteUsers.forEach(unsubscribe)
        }
    }, [remoteUsers, autoSubscribe])

    return [subscribeConfigs, subscribe, unsubscribe]
}

import { createContext } from 'react'

export type AgoraRTCEvent =
    | 'connection-state-change'
    | 'user-joined'
    | 'user-left'
    | 'user-published'
    | 'user-unpublished'
    | 'user-info-updated'
    | 'media-reconnect-start'
    | 'media-reconnect-end'
    | 'stream-type-changed'
    | 'stream-fallback'
    | 'channel-media-relay-state'
    | 'channel-media-relay-event'
    | 'volume-indicator'
    | 'crypt-error'
    | 'token-privilege-will-expire'
    | 'token-privilege-did-expire'
    | 'network-quality'
    | 'live-streaming-error'
    | 'live-streaming-warning'
    | 'exception'
    | 'is-using-cloud-proxy'
    | 'join-fallback-to-proxy'
    | 'published-user-list'
    | 'content-inspect-connection-state-change'
    | 'content-inspect-error'

interface EventContextValue {
    on(ev: AgoraRTCEvent, callback: Function, key: number): void
    off(ev: AgoraRTCEvent, key: number): void
}

export const AgoraRTCEventContext = createContext<EventContextValue>({
    on: () => { },
    off: () => { },
})

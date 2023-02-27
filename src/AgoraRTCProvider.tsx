import React, { useCallback, useEffect, useState, useRef } from 'react'

import { RecoilRoot, RecoilRootProps } from 'recoil'
import AgoraRTC, { ClientConfig, IAgoraRTCClient } from 'agora-rtc-sdk-ng'

import { AgoraRTCConnection } from './AgoraRTCConnection'
import { AgoraRTCContext } from './AgoraRTCContext'
import { AgoraRTCEvent, AgoraRTCEventContext } from './AgoraRTCEventContext'
import { AgoraRTCUsers } from './AgoraRTCUsers'
import { AgoraRTCDevices } from './AgoraRTCDevices'

type BaseProps =
  | ClientConfig
  | {
      client: IAgoraRTCClient
    }

type Props = BaseProps & {
  recoilRootProps?: Omit<RecoilRootProps, 'children'>
}

type EventsMap = Partial<Record<AgoraRTCEvent, Map<number, Function>>>

export const AgoraRTCProvider: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  recoilRootProps = {},
  ...props
}) => {
  const [client, setClient] = useState<IAgoraRTCClient>()
  const eventsMap = useRef<EventsMap>({})

  const handleEvent = useCallback(
    (event: AgoraRTCEvent) =>
      (...ev: any[]) => {
        // @ts-ignore
        for (let cb of eventsMap.current?.[event]?.values() ?? []) {
          cb(...ev)
        }
      },
    []
  )

  const initEventHandlers = useCallback(
    (client?: IAgoraRTCClient) => {
      if (!client) return
      console.warn('initEventHandlers')
      ;(Object.keys(eventsMap.current) as AgoraRTCEvent[]).forEach((event) => {
        client.off(event, handleEvent(event))
        client.on(event, handleEvent(event))
      })
    },
    [handleEvent]
  )

  useEffect(() => {
    if (client) return
    if ('client' in props) {
      setClient(props.client)
      initEventHandlers(props.client)
      return
    }
    const cli = AgoraRTC.createClient(props)
    setClient(cli)
    initEventHandlers(cli)
  }, [client, initEventHandlers, props])

  /**
   * Registers event callback.
   */
  const on = useCallback(
    (ev: AgoraRTCEvent, cb: Function, key: number) => {
      console.warn('on', ev, key, eventsMap.current)
      if (!eventsMap.current[ev]) {
        eventsMap.current[ev] = new Map()
        if (client) {
          /**
           * Make sure only 1 event listener is registered at anytime for handleEvent.
           * Otherwise events sent from daily-js might be handled multiple times.
           */
          client.off(ev, handleEvent)
          client.on(ev, handleEvent)
        }
      }
      if (!eventsMap.current[ev]?.has(key)) {
        eventsMap.current[ev]?.set(key, cb)
      }
    },
    [client, handleEvent]
  )

  /**
   * Unregisters event callback.
   */
  const off = useCallback(
    (ev: AgoraRTCEvent, key: number) => {
      console.warn('off', ev, key, eventsMap.current)
      eventsMap.current[ev]?.delete(key)
      if (eventsMap.current[ev]?.size === 0) {
        client?.off(ev, handleEvent)
        delete eventsMap.current[ev]
      }
    },
    [client, handleEvent]
  )

  return (
    <RecoilRoot {...recoilRootProps}>
      <AgoraRTCContext.Provider value={client}>
        <AgoraRTCEventContext.Provider value={{ on, off }}>
          <AgoraRTCUsers>
            <AgoraRTCConnection>
              <AgoraRTCDevices>{children}</AgoraRTCDevices>
            </AgoraRTCConnection>
          </AgoraRTCUsers>
        </AgoraRTCEventContext.Provider>
      </AgoraRTCContext.Provider>
    </RecoilRoot>
  )
}

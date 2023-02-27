import { useContext, useState, useRef, useMemo, useEffect } from "react"

import { AgoraRTCEvent, AgoraRTCEventContext } from "../AgoraRTCEventContext"

let uniqueCounter = 0
export const getUnique = () => uniqueCounter++

export const useAgoraRTCEvent = (ev: AgoraRTCEvent, callback: Function) => {
    const { off, on } = useContext(AgoraRTCEventContext)
    const [isBlocked, setIsBlocked] = useState(false)
    const reassignCount = useRef<number>(0)

    const eventId = useMemo(() => getUnique(), [])

    useEffect(() => {
        if (!ev || isBlocked) return
        /**
         * Check if callback has been reassigned often enough without hitting the 50ms timeout.
         */
        if (reassignCount.current > 100000) {
            console.error(
                `useDailyEvent called with potentially non-memoized event callback or due to too many re-renders.
            Memoize using useCallback to avoid re-render loop or reduce the amount of state transitions the callback depends on.
            Passed callback for '${ev}' event is NOT registered.`,
                callback
            )
            setIsBlocked(true)
            return
        }
        reassignCount.current++
        const timeout = setTimeout(() => {
            reassignCount.current = 0
        }, 50)
        on(ev, callback, eventId)
        return () => {
            clearTimeout(timeout)
            off(ev, eventId)
        }
    }, [callback, ev, eventId, isBlocked, off, on])
}
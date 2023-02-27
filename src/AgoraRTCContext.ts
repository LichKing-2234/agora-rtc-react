import { createContext } from 'react'

import { IAgoraRTCClient } from 'agora-rtc-sdk-ng'

export const AgoraRTCContext = createContext<IAgoraRTCClient | undefined>(undefined)

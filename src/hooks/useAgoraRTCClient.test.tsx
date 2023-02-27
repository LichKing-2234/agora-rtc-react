import React from 'react'
import { renderHook } from '@testing-library/react-hooks'

import { useAgoraRTCClient } from './useAgoraRTCClient'
import { AgoraRTCProvider } from '../AgoraRTCProvider'

const mockClient = {}

jest.mock('agora-rtc-sdk-ng', () => {
  const originalModule = jest.requireActual('agora-rtc-sdk-ng')

  return {
    __esModule: true,
    ...originalModule,
    default: {
      createClient: () => {
        return mockClient
      }
    }
  }
})

test('useAgoraRTCClient', () => {
  const { result } = renderHook(() => useAgoraRTCClient(), {
    wrapper: ({ children }) => (
      <AgoraRTCProvider codec='vp8' mode='rtc'>
        {children}
      </AgoraRTCProvider>
    )
  })

  expect(result.current).toBe(mockClient)
})

import React, { useCallback, useState } from 'react'
import { AgoraRTCProvider } from 'agora-rtc-react'
import AgoraRTC from 'agora-rtc-sdk-ng'

import { Camera, Screen } from './components'
import styles from './styles.module.css'

const App = () => {
  const [show, setShow] = useState(false)

  const handleClick = useCallback(() => {
    setShow(!show)
  }, [show])

  return (
    <>
      <AgoraRTCProvider codec='vp8' mode='rtc'>
        <Camera />
      </AgoraRTCProvider>
      <AgoraRTCProvider
        client={AgoraRTC.createClient({ codec: 'vp8', mode: 'rtc' })}
      >
        {show ? <Screen /> : undefined}
        <button className={styles.test} onClick={handleClick}>
          {`${show ? 'stop' : 'start'} screen sharing`}
        </button>
      </AgoraRTCProvider>
    </>
  )
}

export default App

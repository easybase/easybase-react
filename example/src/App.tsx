/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import ebconfig from "./ebconfig.json";

import { useEasybase, EasybaseProvider } from 'easybase-react'

// here

const App = () => {

  const { Frame, useFrameEffect } = useEasybase();

  useFrameEffect(() => {
    console.log(Frame());
  })

  return (
    <EasybaseProvider ebconfig={ebconfig}>
      <h1>HELLO WORLD</h1>
    </EasybaseProvider>
  )
}

export default App

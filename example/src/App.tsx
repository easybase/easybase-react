/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from 'react'
import ebconfig from "./ebconfig.json";

import { useEasybase, EasybaseProvider } from 'easybase-react'

// here

const App = () => {

  const { Frame, useFrameEffect, configureFrame, sync } = useEasybase();

  useFrameEffect(() => {
    console.log(Frame());
  })

  useEffect(() => {
    configureFrame({ limit: 10, offset: 0 });
    sync();
  }, []);

  return (
    <EasybaseProvider ebconfig={ebconfig}>
      <h1>HELLO WORLD</h1>
    </EasybaseProvider>
  )
}

export default App

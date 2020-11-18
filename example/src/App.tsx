/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import ebconfig from "./ebconfig.json";
import { EasybaseProvider } from 'easybase-react';
import FrameSyncExample from "./FrameSyncExample";
import QueryExample from "./QueryExample";
import "./styles.css";

const App = () => {
  return (
    <EasybaseProvider ebconfig={ebconfig} options={{ logging: false }}>
      <FrameSyncExample />
      <hr className="m-4" />
      <QueryExample />
    </EasybaseProvider>
  )
}

export default App

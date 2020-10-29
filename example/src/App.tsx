/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import ebconfig from "./ebconfig.json";
import { EasybaseProvider } from 'easybase-react';
import MyComponent from "./MyComponent";

const App = () => {
  return (
    <EasybaseProvider ebconfig={ebconfig}>
      <MyComponent />
    </EasybaseProvider>
  )
}

export default App

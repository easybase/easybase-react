/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import ebconfig from "./ebconfig.json";
import { EasybaseProvider } from 'easybase-react';
import MyComponent from "./MyComponent";
import "./styles.css";

const App = () => {
  return (
    <EasybaseProvider ebconfig={ebconfig} options={{ logging: true }}>
      <MyComponent />
    </EasybaseProvider>
  )
}

export default App

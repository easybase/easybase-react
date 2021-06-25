<br />
<br />

<p align="center">
  <a href="https://easybase.io">
    <img src="https://easybase.io/assets/images/logo_black.png" alt="easybase logo black" width="80" height="80">
  </a>
</p>

<br />

<p align="center">
  <img alt="npm" src="https://img.shields.io/npm/dw/easybase-react">
  <img alt="GitHub" src="https://img.shields.io/github/license/easybase/easybase-react">
  <img alt="npm bundle size" src="https://img.shields.io/bundlephobia/min/easybase-react">
  <img alt="npm" src="https://img.shields.io/npm/v/easybase-react">
</p>


<h2 align="center">
  <b>
    <a href="https://easybase.io/react/">
      Head here for the full React & React Native walkthrough 📗📘
    </a>
  </b>
</h2>

<br />

React and React Native compatible library for use with Easybase, a visual database for serverless applications. `easybase-react` can be used with a table's REACT integration or with a Project. In the latter case, this package provides functions for managing user authentication. [Get your project up-and-running in just a couple minutes](https://easybase.io/react/#setup).


<!-- DOCUMENTATION -->
## Documentation

Formal documentation for this library [is available here](https://easybase.io/docs/easybase-react/).

Information on **database querying** [can be found in the EasyQB docs](https://easybase.github.io/EasyQB/).

## Getting Started

Download your `ebconfig` token and place it at the root of your project

```
├── src/
│   ├── App.js
│   ├── index.js
│   └── ebconfig.js  <–––
├── assets/
├── package.json
└── ...
```

Then, wrap your root component in *EasybaseProvider* with your credentials.
```
npm install easybase-react
```

```jsx
import React, { useEffect } from "react";
import { EasybaseProvider, useEasybase } from 'easybase-react';
import ebconfig from "./ebconfig";

function App() {
  return (
    <EasybaseProvider ebconfig={ebconfig}>
      <Container />
    </EasybaseProvider>
  );
}
```

## Examples

* [Single Component User Authentication](https://easybase.io/react-and-react-native-user-authentication/)

* [Stateful Database](https://easybase.io/react-database-app-tutorial/)

* [Google Analytics Integration](https://easybase.io/react/#google-analytics-integration)

<!-- CONTACT -->
## Contact

[@easybase_io](https://twitter.com/easybase_io) – hello@easybase.io

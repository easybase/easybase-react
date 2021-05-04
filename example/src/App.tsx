/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import ebconfig from "./ebconfig.json";
import ebconfig2 from "./ebconfig2";
import { EasybaseProvider } from 'easybase-react';
import FrameSyncExample from "./FrameSyncExample";
import QueryExample from "./QueryExample";
import FunctionExample from "./CloudFunctionExample";
import DbExample from "./DbExample";
import "./styles.css";
import {
  HashRouter,
  Switch,
  Route,
  Link
} from "react-router-dom";
import ProjectUser from "./ProjectUser";

const IntegrationExample = () => (
  <EasybaseProvider ebconfig={ebconfig} options={{ logging: false }}>
    <FrameSyncExample />
    <hr className="m-4" />
    <QueryExample />
    <hr className="m-4" />
    <FunctionExample />
    <hr className="m-4" />
    <DbExample />
  </EasybaseProvider>
)

const ProjectExample = () => (
  <EasybaseProvider ebconfig={ebconfig} options={{ logging: true }}>
    <ProjectUser />
  </EasybaseProvider>
)

const App = () => {
  return (
    <HashRouter>
      <ul>
        <li>
          <Link to="/">Integration Example</Link>
        </li>
        <li>
          <Link to="/project">Project Example</Link>
        </li>
      </ul>

      <Switch>
        <Route path="/" exact>
          <IntegrationExample />
        </Route>
        <Route path="/project" exact >
          <ProjectExample />
        </Route>
      </Switch>
    </HashRouter>
  )
}

export default App;

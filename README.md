

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
<!-- [![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url] -->


<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://easybase.io">
    <img src="https://easybase.io/assets/images/logo_black.png" alt="Logo" width="80" height="80" href="easybase logo black">
  </a>
</p>

<br />

<p align="center">
  <img alt="npm" src="https://img.shields.io/npm/dw/easybase-react">
  <img alt="GitHub" src="https://img.shields.io/github/license/easybase/easybase-react">
  <img alt="npm bundle size" src="https://img.shields.io/bundlephobia/min/easybase-react">
  <img alt="npm" src="https://img.shields.io/npm/v/easybase-react">
</p>

<br />

<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Usage](#usage)
* [Types and Options](#types-and-options)
* [useEasybase](#useEasybase)
* [Example](#example)
* [Roadmap](#roadmap)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)



<!-- ABOUT THE PROJECT -->
## About The Project



### Built With

* [create-react-library](https://github.com/transitive-bullshit/create-react-library)
* [axios](https://github.com/axios/axios)
* [Easybase.io](https://easybase.io)
* [object-observer](https://github.com/gullerya/object-observer)


<!-- GETTING STARTED -->
## Getting Started
**React and React Native** compatible library for use with EasyBase. This library can be used with a table specific REACT integration or with a project. Features of either integration:

<table>
  <tr>
    <th>REACT Integration</th>
    <th>Project</th>
  </tr>
  <tr>
    <td>Custom table permissions</td>
    <td>Custom table permissions</td>
  </tr>
  <tr>
    <td>Live usage analytics</td>
    <td>Live usage analytics</td>
  </tr>
  <tr>
    <td>Stateful database array</td>
    <td>Stateful database array</td>
  </tr>
  <tr>
    <td>Access to visual queries</td>
    <td>Access to visual queries</td>
  </tr>
  <tr>
    <td style="color: #00000061">User authentication</td>
    <td>User authentication</td>
  </tr>
  <tr>
    <td style="color: #00000061">Get/Set user attributes</td>
    <td>Get/Set user attributes</td>
  </tr>
  <tr>
    <td style="color: #00000061">Access multiple tables</td>
    <td>Access multiple tables</td>
  </tr>
  <tr>
    <td style="color: #00000061">Associate records to users</td>
    <td>Associate records to users</td>
  </tr>
</table>

<br />

[Click here](https://easybase.io/about/2020/09/20/The-Best-Way-To-Add-A-Database-To-Your-React-React-Native-Apps/) to learn more about Easybase.io and check out the examples below.

### Prerequisites

* React 16 or greater
* npm

### Installation
```sh
npm install easybase-react
```
<br />

#### **Create a React integration or Project**
<img src="./assets/react-integration-3.gif">

<br />
<br />

<img src="./assets/users-2.gif">


<br />
<br />

#### **Then, download your token and place it the root of your project**

<br />

<!-- USAGE EXAMPLES -->
## Usage

Wrap your root component in *EasybaseProvider* with your credentials.
```jsx
import React, { useEffect } from "react";
import { EasybaseProvider, useEasybase } from 'easybase-react';
import ebconfig from "./ebconfig.json";

function App() {
  return (
    <EasybaseProvider ebconfig={ebconfig}>
      <Container />
    </EasybaseProvider>
  );
}
```

<br />

Next, if you're using a project, allow users to sign in or sign up.
```jsx
function ProjectUser() {
  const [usernameValue, setUsernameValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  const {
    isUserSignedIn,
    signIn,
    signUp,
    getUserAttributes
  } = useEasybase();

  if (isUserSignedIn()) {
    return (
      <div>
        <h2>Your signed in!</h2>
        <button onClick={ _ => getUserAttributes().then(console.log) }>
          Click me only works if your authenticated!
        </button>
        <Container />
      </div>
    )
  } else {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <h4>Username</h4>
        <input value={usernameValue} onChange={e => setUsernameValue(e.target.value)} />
        <h4>Password</h4>
        <input type="password" value={passwordValue} onChange={e => setPasswordValue(e.target.value)} />
        <button onClick={_ => signIn(usernameValue, passwordValue)}>
          Sign In
        </button>
        <button onClick={_ => signUp(usernameValue, passwordValue)}>
          Sign Up
        </button>
      </div>
    )
  }
}
```

<br />

Then, interface with your data in a stateful and synchronous way.
```jsx
function Container() {
  const { Frame, useFrameEffect, configureFrame, sync } = useEasybase();

  useEffect(() => {
    configureFrame({ limit: 10, offset: 0 });
    sync();
  }, []);

  useFrameEffect(() => {
    console.log("Frame data changed!");
  });

  const onChange = (index, column, newValue) => {
      Frame(index)[column] = newValue;
      sync();
  }

  return (
    <div>
      {Frame().map(ele => <Card {...ele} onChange={onChange} index={index}  />)}
    </div>
  )

}
```
 
**Frame()** acts just like a plain array! When you want to push changes and synchronize with your data, just call **sync()**.

<br />

## **useEasybase**

<br />

### **Database array:**

### configureFrame(options: ConfigureFrameOptions): StatusResponse
Configure the current frame size. Set the offset and amount of records to retreive assume you don't want to receive your entire collection. This is useful for paging.

### sync(): Promise\<StatusResponse>
Call this method to syncronize your current changes with your database. Delections, additions, and changes will all be reflected by your backend after calling this method. Call Frame() after this to get a normalized array of the freshest data.

### Frame(index?: number): Record<string, any> | Record<string, any>[]
This function is how you access a single object your current frame. This function does not get new data or push changes to EasyBase. If you want to syncronize your frame and EasyBase, call sync() then Frame(). Passing an index will only return the object at that index in your Frame, rather than the entire array. This is useful for editing single objects based on an index.

### useFrameEffect(effect: React.EffectCallback): void
This hook runs when the Frame changes. This can be triggered by calling sync().

### currentConfiguration(): FrameConfiguration
View your frames current configuration

<br />

### **User authentication and attributes:**

### signUp(newUserID: string, password: string, userAttributes?: Record<string, string>): Promise<StatusResponse>
Create a new user for your project. You must still call signIn() after signing up.

### signIn(userID: string, password: string): Promise<StatusResponse>
Sign in a user that already exists for a project. This will save authentication tokens to a user's browser so that they will be automatically authenticated when they return to the application. These authentcation tokens will become invalid when a user signs out or after 24 hours.

### onSignIn(callback: () => void): void
Pass a callback function to run when a user signs in. This callback function will run after either successfully signing in with the signIn() function OR after a user is automatically signed in via valid tokens saved to the browser from a previous instance.

### signOut(): void
Sign out the current user and invalidate their cached tokens.

### setUserAttribute(key: string, value: string): Promise<StatusResponse>
Set a single attribute of the currently signed in user. Can also be updated visually in the Easybase 'Users' tab.

### getUserAttributes(): Promise<Record<string, string>>
Retrieve the currently signed in users attribute object.

### isUserSignedIn(): boolean
Check if a user is currently signed in.

<br />

### **Miscellaneous:**

*Note the below functions are isolated and do not have an effect on the synchronicity of Frame() as those above.*

### Query(options: QueryOptions): Promise<Record<string, any>[]>
Perform a query created in the Easybase Visual Query Builder by name. This returns an isolated array that has no effect on your frame or frame configuration. sync() and Frame() have no relationship with a Query(). An edited Query cannot be synced with your database, use Frame() for realtime database array features.

### fullTableSize(tableName?: string): Promise\<number>
Gets the number of records in your table.

### tableTypes(tableName?: string): Promise<Record<string, any>>
Retrieve an object detailing the columns in your table mapped to their corresponding type.

### updateRecordImage(options: UpdateRecordAttachmentOptions): Promise\<StatusResponse>
Upload an image to your backend and attach it to a specific record. columnName must reference a column of type 'image'. The file must have an extension of an image. Call sync() for fresh data with propery attachment links to cloud hosting.

### updateRecordVideo(options: UpdateRecordAttachmentOptions): Promise\<StatusResponse>
Upload a video to your backend and attach it to a specific record. columnName must reference a column of type 'video'. The file must have an extension of a video. Call sync() for fresh data with propery attachment links to cloud hosting.

### updateRecordFile(options: UpdateRecordAttachmentOptions): Promise\<StatusResponse>
Upload a file to your backend and attach it to a specific record. columnName must reference a column of type 'file'. Call sync() for fresh data with propery attachment links to cloud hosting.

### addRecord(options: AddRecordOptions): Promise\<StatusRespnse>
Manually add a record to your collection regardless of your current frame. You must call sync() after this to see updated response.

### deleteRecord(record: Record<string, any>): Promise\<StatusResponse>
Manually delete a record from your collection regardless of your current frame. You must call sync() after this to see updated response.

<br />

## **Types and Options**

<br />

```ts
interface StatusResponse {
    /** Returns true if the operation was successful */
    success: boolean;
    /** Readable description of the the operation's status */
    message: string;
    /** Will represent a corresponding error if an error was thrown during the operation. */
    error?: Error;
}

interface EasybaseProviderPropsOptions {
    /** Custom authentication string. Can be set in integration menu. If it is set, it is required to access integration. This acts as an extra layer of security and extensibility. */
    authentication?: string;
    /** Log Easybase react status and events to console. */
    logging?: boolean;
}

interface EasybaseProviderProps {
    /** React elements */
    children: JSX.Element[] | JSX.Element;
    /** EasyBase ebconfig object. Can be downloaded in the integration drawer next to 'React Token'. This is automatically generated.  */
    ebconfig: Ebconfig;
    /** Optional configuration parameters. */
    options?: EasybaseProviderPropsOptions
}

interface AddRecordOptions {
    /** If true, record will be inserted at the end of the collection rather than the front. Overwrites absoluteIndex. */
    insertAtEnd?: boolean;
    /** Values to post to EasyBase collection. Format is { column name: value } */
    newRecord: Record<string, any>;
    /** Table to post new record to. (Projects only) */
    tableName?: string;
}
interface DeleteRecordOptions {
    record: Record<string, any>;
    /** Table to delete record from. (Projects only) */
    tableName?: string;
}

interface QueryOptions {
    /** Name of the query saved in Easybase's Visual Query Builder */
    queryName: string;
    /** If you would like to sort the order of your query by a column. Pass the name of that column here */
    sortBy?: string;
    /** By default, columnToSortBy will sort your query by ascending value (1, 2, 3...). To sort by descending set this to true */
    descending?: boolean;
    /** Edit starting index from which records will be retrieved from. Useful for paging. */
    offset?: number;
    /** Limit the amount of records to be retrieved. Can be used in combination with offset. */
    limit?: number;
    /** This object can be set to overwrite the query values as set in the integration menu. If your query is setup to find records where 'age' >= 0, passing in { age: 50 } will query where 'age' >= 50. Read more: https://easybase.io/about/2020/09/15/Customizing-query-values/ */
    customQuery?: Record<string, any>;
    /** Table to query. (Projects only) */
    tableName?: string;
}

interface ConfigureFrameOptions {
    /** Edit starting index from which records will be retrieved from. Useful for paging. */
    offset?: number;
    /** Limit the amount of records to be retrieved. Set to -1 or null to return all records. Can be used in combination with offset. */
    limit?: number | null;
    /** Table to sync frame with. (Projects only) */
    tableName?: string;
}

interface FrameConfiguration {
    /** Edit starting index from which records will be retrieved from. Useful for paging. */
    offset: number;
    /** Limit the amount of records to be retrieved. Set to -1 or null to return all records. Can be used in combination with offset. */
    limit: number | null;
    /** Table to sync frame with. (Projects only) */
    tableName?: string;
}

interface UpdateRecordAttachmentOptions {
    /** EasyBase Record to attach this attachment to */
    record: Record<string, any>;
    /** The name of the column that is of type file/image/video */
    columnName: string;
    /** Either an HTML File element containing the correct type of attachment or a FileFromURI object for React Native instances.
     * For React Native use libraries such as react-native-image-picker and react-native-document-picker.
     * The file name must have a proper file extension corresponding to the attachment. 
     */
    attachment: File | FileFromURI;
    /** Table to post attachment to. (Projects only) */
    tableName?: string;
}
```

<!-- EXAMPLES -->
## Example

#### [Stateful database array walkthrough](https://easybase.io/react/2020/09/20/The-Best-Way-To-Add-A-Database-To-Your-React-React-Native-Apps/)

#### [User authentication walkthrough](https://easybase.io/react/2020/09/20/The-Best-Way-To-Add-A-Database-To-Your-React-React-Native-Apps/)

<!-- ROADMAP -->
## Roadmap

See the [open issues](https://github.com/easybase/easybase-react/issues) for a list of proposed features (and known issues).


<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/EasybaseReactFeature`)
3. Commit your Changes (`git commit -m 'feature'`)
4. Push to the Branch (`git push origin feature/EasybaseReactFeature`)
5. Open a Pull Request


<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.



<!-- CONTACT -->
## Contact

[@easybase_io](https://twitter.com/easybase_io) - hello@easybase.io

Project Link: [https://github.com/easybase/easybase-react](https://github.com/easybase/easybase-react)




<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
<!-- [contributors-shield]: https://img.shields.io/github/contributors/easybase/repo.svg?style=flat-square
[contributors-url]: https://github.com/easybase/repo/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/easybase/repo.svg?style=flat-square
[forks-url]: https://github.com/easybase/repo/network/members
[stars-shield]: https://img.shields.io/github/stars/easybase/repo.svg?style=flat-square
[stars-url]: https://github.com/easybase/repo/stargazers
[issues-shield]: https://img.shields.io/github/issues/easybase/repo.svg?style=flat-square
[issues-url]: https://github.com/easybase/repo/issues
[license-shield]: https://img.shields.io/github/license/easybase/repo.svg?style=flat-square
[license-url]: https://github.com/easybase/repo/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=flat-square&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/easybase
[product-screenshot]: images/screenshot.png -->
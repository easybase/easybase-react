/* eslint-disable operator-linebreak */
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { useEasybase, EasybaseProvider } from 'easybase-react';
import { NativeAuth } from 'easybase-react/native';
import ebconfig from './ebconfig';

function Account() {
  const [userVal, setUserVal] = useState("");
  const [passVal, setPassVal] = useState("");

  const { signIn, signUp } = useEasybase();

  const clearInputs = () => {
    setUserVal("");
    setPassVal("");
  }

  const handleSignInPress = async () => {
    await signIn(userVal, passVal);
    clearInputs();
  }

  const handleSignUpPress = async () => {
    const res = await signUp(userVal, passVal, {
      created_at: new Date().toString
    });
    if (res.success) {
      await signIn(userVal, passVal);
    }
    clearInputs();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to React-flix!</Text>
      <TextInput value={userVal} onChangeText={e => setUserVal(e)} style={styles.accountInput} placeholder="Username" />
      <TextInput value={passVal} onChangeText={e => setPassVal(e)} style={styles.accountInput} placeholder="Password" />
      <View style={{ display: "flex", flexDirection: "row", marginTop: 30 }}>
        <Button title="Sign In" onPress={handleSignInPress} />
        <Button title="Sign Up" onPress={handleSignUpPress} />
      </View>
    </View>
  )
}

function Router() {
  const { isUserSignedIn } = useEasybase();

  return (
    isUserSignedIn() ?
      <Text>Congrats! You're signed in.</Text>
      :
      <Account />
  )
}

export default function app() {
  return (
    <EasybaseProvider ebconfig={ebconfig}>
      {/* <Router /> */}
      {/* <View style={styles.container}> */}
        <NativeAuth>
          <View style={styles.container}>
            <Text>You're in</Text>
          </View>
        </NativeAuth>
      {/* </View> */}
    </EasybaseProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  accountInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: "75%",
    margin: 10,
    fontSize: 22,
    textAlign: "center"
  },
  title: {
    fontSize: 30,
    fontWeight: "500",
    fontStyle: "italic",
    marginBottom: 30
  }
});

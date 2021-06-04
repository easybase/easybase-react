/* eslint-disable no-undef */
/* eslint-disable operator-linebreak */
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { useEasybase, EasybaseProvider } from 'easybase-react';
import { NativeAuth } from 'easybase-react/native';
import ebconfig from './ebconfig';

const SignOutButton = () => <Button onPress={useEasybase().signOut} title="Sign Out" />

export default function app() {
  return (
    <EasybaseProvider ebconfig={ebconfig}>
        <NativeAuth signUpFields={{ fullName: true, lastName: true }}>
          <View style={styles.container}>
            <Text>You're in</Text>
            <SignOutButton />
          </View>
        </NativeAuth>
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

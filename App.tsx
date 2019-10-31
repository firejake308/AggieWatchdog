import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Platform, StatusBar } from 'react-native';
import { Root, Container, Header, Left, Right, Title, Icon } from 'native-base';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';

export default function App() {
  const [loading, setLoading] =  useState(true);
  
  useEffect(() => {
    async function loadFont() {
      await Font.loadAsync({
        Roboto: require('native-base/Fonts/Roboto.ttf'),
        Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      })
      setLoading(false);
    }
    loadFont(); 
  }, [loading]);

  if (loading)
    return (
      <Root>
        <AppLoading />
      </Root>
    )

  return (
    <Root>
      <Container>
        <Header style={styles.customHeader}>
          <Left>
            <Title>PingMe</Title>
          </Left>
          <Right>
            <Icon name="save" color="white" />
          </Right>
        </Header>
      </Container>
    </Root>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  customHeader: {
    paddingTop: StatusBar.currentHeight,
    height: 54 + StatusBar.currentHeight
  }
});

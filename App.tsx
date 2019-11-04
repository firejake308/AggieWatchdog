import React, { useEffect, useState, ReactNode } from 'react';
import { StyleSheet, StatusBar, TouchableHighlight, TouchableNativeFeedback } from 'react-native';
import { Root, Container, Header, Body, Right, Title, Icon, Content, Button, Fab } from 'native-base';
import { AppLoading } from 'expo';
import Constants from 'expo-constants';
import * as Font from 'expo-font';

import CardList from './CardList';

export default function App() {
  const [loading, setLoading] =  useState(true);
  const cardListRef = React.useRef();

  // load fonts before rendering native base elements
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
      <Container style={{backgroundColor: '#500000'}}>
        <Header style={styles.customHeader} androidStatusBarColor="#500000">
          <Body>
            <Title>PingMe</Title>
          </Body>
          <Right>
            <Button 
              style={styles.flatButton}
              onPress={
                // @ts-ignore
                () => cardListRef.current && cardListRef.current.updateCourses()}>
              <Icon name="save" style={styles.lightIcon} />
            </Button>
          </Right>
        </Header>
        <Content style={styles.container}>
          <CardList ref={cardListRef} />
        </Content>
        <Fab
                position="bottomRight"
                onPress={
                  // @ts-ignore
                  () => cardListRef.current && cardListRef.current.addCard()}
                style={styles.maroon}
            >
                <Icon name="add" />
            </Fab>
      </Container>
    </Root>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ddd',
  },
  customHeader: {
    /*marginTop: Constants.statusBarHeight,*/
    backgroundColor: '#500000'
  },
  maroon: {
    backgroundColor: '#500000',
  },
  lightIcon: {
    color: 'white',
  },
  flatButton: {
    backgroundColor: '#500000',
    elevation: 0
  }
});

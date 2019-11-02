import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Platform, StatusBar } from 'react-native';
import { Root, Container, Header, Body, Right, Title, Icon, Content, Button, Fab } from 'native-base';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';

import CardList from './CardList';

export default function App() {
  const [loading, setLoading] =  useState(true);
  const cardListRef = React.useRef();
  
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
          <Body>
            <Title>PingMe</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name="save" style={styles.lightIcon} />
            </Button>
          </Right>
        </Header>
        <Content style={styles.container}>
          <CardList ref={cardListRef} />
        </Content>
        <Fab
                position="bottomRight"
                onPress={() => cardListRef.current && cardListRef.current.addCard()}
                style={{backgroundColor: '#500000'}}
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
    paddingTop: StatusBar.currentHeight,
    height: 54 + StatusBar.currentHeight,
    backgroundColor: '#500000',
  },
  lightIcon: {
    color: 'white',
  },
});

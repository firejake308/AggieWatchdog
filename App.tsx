import React, { useEffect, useState } from 'react';
import { StyleSheet, Platform } from 'react-native';
import { Root, Container, Header, Body, Right, Title, Icon, Content, Button, Fab, Spinner } from 'native-base';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';

import CardList from './CardList';

export default function App() {
  const [fontLoading, setFontLoading] = useState(true);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const cardListRef = React.useRef();

  // load fonts before rendering native base elements
  useEffect(() => {
    async function loadFont() {
      await Font.loadAsync({
        Roboto: require('native-base/Fonts/Roboto.ttf'),
        Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      })
      setFontLoading(false);
    }
    loadFont(); 
  }, [fontLoading]);

  if (fontLoading)
    return (
      <Root>
        <AppLoading />
      </Root>
    )

  return (
    <Root>
      <Container style={Platform.OS === 'android' ? {backgroundColor: '#500000'} : {}}>
        <Header style={ Platform.OS === 'android' ? styles.customHeader : {}} androidStatusBarColor="#500000">
          <Body>
            <Title>Aggie Watchdog</Title>
          </Body>
          <Right>
            <Button 
              style={styles.flatButton}
              onPress={
                // @ts-ignore
                () => setCoursesLoading(true) || cardListRef.current && cardListRef.current.updateCourses()
                .then(() => setCoursesLoading(false))}>
              {coursesLoading? <Spinner color="white" /> : <Icon name="save" style={styles.lightIcon} />}
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

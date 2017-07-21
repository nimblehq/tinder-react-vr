import React from 'react';
import { AppRegistry } from 'react-vr';
import HomeContainer from './src/containers/home';

export default class TinderReactVR extends React.Component {
  render() {
    return (
      <HomeContainer />
    );
  }
};

AppRegistry.registerComponent('TinderReactVR', () => TinderReactVR);

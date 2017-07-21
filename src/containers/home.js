import React from 'react';
import { asset, Pano, View, Image, VrButton, Text } from 'react-vr';
import config from '../config';

export default class HomeContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tinderToken: null,
      users: [],
      currentIndex: 0,
      currentUser: null
    }
  }

  componentDidMount() {
    this._getTinderToken();
  }

  render() {
    if (!this.state.currentUser) {
      return (<View>
        <Pano source={asset('chess-world.jpg')}/>
        <Text style={{fontSize: 1, transform: [{translate: [-1, 1, -6]}]}}>
          Loading
        </Text>
      </View>)
    }

    return(
      <View>
        <Pano source={asset('chess-world.jpg')}/>
        <View style={{flex: 1, flexDirection: 'row', transform: [{translate: [-1, 1.5, -6]}]}}>
          <Image source={{uri: config.proxyUrl + this.state.currentUser.photos[0].url}}
                 style={{width: 2, height: 2}}/>

          <VrButton style={{marginLeft: 0.5}} onClick={()=>this._onNextClicked()}>
            <Text style={{fontSize: 1}}>
              Next
            </Text>
          </VrButton>
        </View>
        <Text style={{
          transform: [{translate: [-1, 1.5, -6]}],
          fontSize: 1,
          color: 'blue'
        }}>
          {this.state.currentUser.name}
        </Text>
      </View>
    )
  }

  _getTinderToken() {
    return fetch(config.proxyUrl + 'https://api.gotinder.com/auth', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      mode: 'no-cors',
      body: JSON.stringify({
        facebook_token: config.facebook_token,
        facebook_id: config.facebook_id
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({tinderToken: responseJson.token});
      this._getUsers();
    })
    .catch((error) => {
      console.warn(error);
    });
  }

  _getUsers() {
    return fetch(config.proxyUrl + 'https://api.gotinder.com/user/recs', {
      method: 'GET',
      mode: 'no-cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Auth-Token': this.state.tinderToken
      }
    })
    .then((response) => response.json())
    .then((responseJson) => {
      let users = responseJson.results;
      this.setState({users: users, currentUser: users[this.state.currentIndex]});
    })
    .catch((error) => {
      console.warn(error);
    });
  }

  _onNextClicked() {
    let nextIndex = this.state.currentIndex + 1;
    if (nextIndex < this.state.users.length) {
      let user = this.state.users[nextIndex];
      this.setState({currentIndex: nextIndex, currentUser: user})
    } else {
      this.setState({currentIndex: 0});
      this._getUsers();
    }
  }
};

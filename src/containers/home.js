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
      currentUser: null,
      liked: false
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
    let floor = config.proxyUrl + 'http://www.tutorialchip.com/wp-content/uploads/2011/12/Wood-floor-520x520.png';
    return(
      <View>
        <Pano source={[{uri: floor}, {uri: floor}, {uri: floor}, {uri: floor}, {uri: floor}, {uri: floor}]}/>
        <View style={{flex: 1, flexDirection: 'column', transform: [{translate: [-1, 1.5, -6]}]}}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <Image source={{uri: config.proxyUrl + this.state.currentUser.photos[0].url}}
                   style={{width: 2, height: 2}}/>

            <Text style={{fontSize: 1, color: 'blue'}}>
              {this.state.currentUser.name}
            </Text>
          </View>

          <View style={{marginTop: 0.1, flexDirection: 'row'}}>
            {
              this.state.liked ? (
                  <Image source={asset('liked.png')}
                         style={{width: 0.5, height: 0.5}}/>
              ) : (
                  <VrButton onClick={()=>this._onLikeClicked()}>
                    <Image source={asset('like.png')}
                           style={{width: 0.5, height: 0.5}}/>
                  </VrButton>
              )
            }

            <VrButton onClick={()=>this._onNextClicked()}>
              <Image source={asset('next.png')}
                     style={{width: 0.5, height: 0.5, marginLeft: 1}}/>
            </VrButton>
          </View>
        </View>
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
    this.setState({liked: false});
    if (nextIndex < this.state.users.length) {
      let user = this.state.users[nextIndex];
      this.setState({currentIndex: nextIndex, currentUser: user})
    } else {
      this.setState({currentIndex: 0});
      this._getUsers();
    }
  }

  _onLikeClicked() {
    let likeUrl = 'https://api.gotinder.com/like/' + this.state.currentUser._id;

    return fetch(config.proxyUrl + likeUrl, {
      method: 'GET',
      mode: 'no-cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Auth-Token': this.state.tinderToken
      }
    })
    .then(() => {
      this.setState({liked: true});
    })
    .catch((error) => {
      console.warn(error);
    });
  }
};

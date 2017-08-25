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
      currentImageIndex: 0,
      currentUser: null,
      liked: false,
      btnLike: asset('like.png')
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
        <View style={{flex: 1, flexDirection: 'column', transform: [{translate: [-1.5, 2, -6]}]}}>
          <View style={{flex: 1, flexDirection: 'column', alignItems: 'center', backgroundColor: 'white', padding: 0.1, borderRadius: 0.05}}>
            <View style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}>
              <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <VrButton
                    style={{opacity: this.state.currentImageIndex > 0 ? 1 : 0}}
                    onClick={()=>this.state.currentImageIndex > 0 ? this._showPreviousImage() : ''}>
                  <Image source={asset('next.png')}
                         style={{width: 0.5, height: 0.5, marginRight: 0.2, transform: [{rotate: '180deg'}]}}/>
                </VrButton>
                <Image source={{uri: this.state.currentImage}}
                       style={{width: 2, height: 2, borderRadius: 0.1}}/>
                <VrButton
                    style={{opacity: this.state.currentImageIndex + 1 < this.state.currentUser.photos.length ? 1 : 0}}
                    onClick={() =>this.state.currentImageIndex + 1 < this.state.currentUser.photos.length ? this._showNextImage() : ''}>
                  <Image source={asset('next.png')}
                         style={{width: 0.5, height: 0.5, marginLeft: 0.2}}/>
                </VrButton>
              </View>

              <Text style={{fontSize: 0.7, color: 'blue'}}>
                {this.state.currentUser.name}
              </Text>
            </View>

            <View style={{marginTop: 0.1, flexDirection: 'row'}}>
              {
                this.state.liked ? (
                  <Image source={asset('liked.png')}
                         style={{width: 0.5, height: 0.5}}/>
                ) : (
                  <VrButton
                    onClick={()=>this._onLikeClicked()}
                    onEnter={() => this.setState({btnLike: asset('liked.png')})}
                    onExit={() => this.setState({btnLike: asset('like.png')})}
                  >
                    <Image source={this.state.btnLike}
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
      this.setState({users: users, currentUser: users[this.state.currentIndex], currentImageIndex: 0, currentImage: config.proxyUrl + users[this.state.currentIndex].photos[0].url});
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
      this.setState({currentIndex: nextIndex, currentUser: user, currentImageIndex: 0, currentImage: config.proxyUrl + user.photos[0].url});
    } else {
      this.setState({currentIndex: 0});
      this._getUsers();
    }
  }

  _showNextImage() {
    let imageIndex = this.state.currentImageIndex + 1;
    this._setImage(imageIndex);
  }

  _showPreviousImage() {
    let imageIndex = this.state.currentImageIndex - 1;
    this._setImage(imageIndex);
  }

  _setImage(imageIndex) {
    this.setState({currentImageIndex: imageIndex, currentImage: config.proxyUrl + this.state.currentUser.photos[imageIndex].url});
  }

  _onLikeClicked() {
    let likeUrl = 'https://api.gotinder.com/like/' + this.state.currentUser._id;
    this.setState({liked: true});

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

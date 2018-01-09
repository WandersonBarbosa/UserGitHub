import React, { Component } from 'react';

import { View, Text, AsyncStorage, TouchableOpacity,Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';
import { NavigationActions } from 'react-navigation';

import styles from './styles';
import { colors } from '../../styles';
import api from '../../services/api';

export default class Header extends Component {
  constructor (props){
    super(props)
    this.state= {
      imgPerfil: ''
    }
  }
  static propTypes = {
    navigation: PropTypes.shape({
      dispatch: PropTypes.func,
    }).isRequired,
  };
  componentWillMount(){
    this.perfil().then(perf=>{
      this.setState({ imgPerfil: perf });
  })
  }
  perfil = async ()=>{
    const username = await AsyncStorage.getItem('@Githuber:username');
    const response = await api.get(`/users/${username}`);
    return response.data.avatar_url;
  }

  logout = () => {
    AsyncStorage.removeItem('@Githuber:username')
      .then(() => {
        const { dispatch } = this.props.navigation;

        const resetAction = NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: 'Welcome' }),
          ],
        });

        dispatch(resetAction);
      });
  };
   
  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.avatar_url}
          source={{ uri: this.state.imgPerfil }}
        />
        <Text style={styles.title}>Githuber</Text>
        <TouchableOpacity onPress={this.logout}>
          <Icon name="exchange" size={14} color={colors.primary} />
        </TouchableOpacity>
      </View>
    );
  }
}
import React,{Component} from 'react';
import { ScrollView, View,PixelRatio, Text,StyleSheet,Dimensions,Image,ListView,Modal,TextInput,TouchableOpacity, Platform, FlatList, ActivityIndicator, AppState, RefreshControl, Alert,TouchableHighlight, BackHandler, Linking,KeyboardAvoidingView, PermissionsAndroid,StatusBar} from 'react-native';
import { StackNavigator,NavigationActions, TabNavigator,DrawerNavigator } from 'react-navigation';
import connect from './connect'
var {height, width} = Dimensions.get('window');
export const deviceHeight = Dimensions.get('window').height;
export const DEVICE_HEIGHT = Platform.select({
  ios: deviceHeight,
  android:
    StatusBar.currentHeight > 24
      ? deviceHeight
      : deviceHeight - StatusBar.currentHeight,
});
import Swiper from 'react-native-swiper';
import AsyncStorage from '@react-native-community/async-storage';

class screen2 extends Component {
  static navigationOptions = ({ navigation }) =>({
    header:null
  });
	constructor(props) {
    super(props);
	    this.state = {
        data:'',
        currentIndex:0,
        index_id:this.props.navigation.state.params.index_id
	   	}
      
      this.onIndexChanged = this.onIndexChanged.bind(this);
	}
	UNSAFE_componentWillReceiveProps(props) {
 		    
 	}
	componentDidMount() {
    this.getMovieDetails()
	}
  componentWillUnmount(){
    const {params} = this.props.navigation.state;
    params.callHome();
  }
  onIndexChanged(e){
    this.setState({currentIndex:e})
  }
  getMovieDetails() {
    let  url = 'http://app.curateus.com/interview/get_preview'
    return fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)
        this.setState({data:responseJson})
      })
      .catch((error) => {
        console.error(error);
      });
  }
  _onMomentumScrollEnd(e, state, context) {
    this.currentIndex = state.index;
    }
	render(){
    console.log(this.state.data)
    console.log(this.state.currentIndex)
    let item = this.state.data
		return( 
			<KeyboardAvoidingView>
      <View style={{paddingTop:(Platform.OS === 'ios') ?20:  0, borderTopColor: 'transparent', borderTopWidth: 4, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white',elevation: 3}}>
      <Text style={{backgroundColor:'white', fontSize: 13,paddingTop: 20, padding: 15,fontFamily:'Din Condensed', textAlign: 'left', color: '#000000'}}  onPress= { ()=> this.props.navigation.goBack(null) }>BACK</Text>
      <Text style={{backgroundColor:'white', fontSize: 13, paddingTop: 20,padding: 15,fontFamily:'Din Condensed', textAlign: 'right', color: '#000000'}}></Text>
      </View>
      <View style={styles.container}>
      <ScrollView>
      {this.state.data != '' ?
        <View>
        <View style={{justifyContent:'center',alignItems:'center',marginTop:10}}>
            <View style={{width: 80,
                            height: 80,borderRadius:40,backgroundColor:'grey'}}>

            </View>
            <Text style={{color:'grey',fontFamily:'Din Condensed',fontSize:15}}>You are recommenting</Text>
            </View>


                        <View style={{justifyContent:'center',alignItems:'center',marginTop:20}}>
                          <Image source={{uri: item.thumbnail}} 
                                                        style={{width:width/1.3,height:width/1.3}}
                                                        resizeMode={'contain'} />
                          <Text style={{fontFamily:'Din Condensed',fontSize:20,fontWeight:'bold'}}>{item.title}</Text>
                          <Text style={{fontFamily:'Din Condensed',fontSize:15,textAlign:'center'}}>{item.description}</Text>
                          <Text style={{fontFamily:'Din Condensed',fontSize:15,textAlign:'center',color:'#88c8e6'}}>{item.tags.map(info=>('#'+info+' '))}</Text>
                        </View>
                        <View style={{flexDirection:'row',marginTop:20}}>
                          <Text style={{fontFamily:'Din Condensed',fontSize:15,fontWeight:'bold',width:width/5}}>Type:</Text>
                          <View style={{width:60,height:30,backgroundColor:'#88c8e6',borderRadius:30,justifyContent:'center'}}>
                            <Text style={{fontFamily:'Din Condensed',fontSize:15,fontWeight:'bold',textAlign:'center',color:'#fff'}}>{item.article_type}</Text>
                          </View>
                        </View>
                        <View style={{flexDirection:'row',marginTop:20}}>
                          <Text style={{fontFamily:'Din Condensed',fontSize:15,fontWeight:'bold',width:width/5}}>Rating:</Text>
                          <View style={{flexDirection:'row'}}>
                            {[...Array(item.rating)].map((elementInArray, index) => ( 
                                 <Image source={ require('../../assets/images/star.png') } style={{ height:30,width:30 }} />
                                ) 
                            )}
                          </View>
                        </View>
                        <View style={{flexDirection:'row',marginTop:20,marginBottom:100}}>
                          <View style={{width:width/5,flexDirection:'row'}}>
                          <Image source={ require('../../assets/images/imdb.png') } style={{ height:30,width:30 }} />
                          <Text style={{fontFamily:'Din Condensed',fontSize:15,fontWeight:'bold'}}>:</Text>
                          </View>
                          <View>
                            <Text style={{fontFamily:'Din Condensed',fontSize:15,fontWeight:'bold',textAlign:'center'}}>{item.imdb_rating != '' ? item.imdb_rating : 'N/A'}</Text>
                          </View>
                        </View>
              </View>
        :
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#88c8e6"/>
        </View>
      }
      </ScrollView>
      <View style={{position:'absolute',bottom:70,right:10,elevation:10}}>
      <TouchableOpacity onPress={()=>{this.getMovieDetails()}}>
        <Image source={ require('../../assets/images/reload.png') } style={{ height:40,width:40 }} />
      </TouchableOpacity>
      </View>
      <TouchableOpacity
          onPress={()=>this.sheduleItem()}
          style={styles.footertouch}>
          <View style={styles.footer}>
            <Text style={styles.footertext}>
              Schedule
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      </KeyboardAvoidingView>
			);
	}
  sheduleItem = async () => {
    try {
        await AsyncStorage.setItem('selected_item', JSON.stringify(this.state.data.title));
        await AsyncStorage.setItem('index_id', JSON.stringify(this.state.index_id));
        this.props.navigation.goBack(null)
      }
      catch(err){
        console.log(err)
      }
  }
}
const styles=StyleSheet.create({
  container:{
          margin:5,
          height:DEVICE_HEIGHT/1.1
            },
	loading: {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            opacity: 0.5,
            justifyContent: 'center',
            alignItems: 'center'
        },
  footer:{
    alignSelf:'flex-end',
    position:'absolute',
    alignSelf:'center',
    backgroundColor:'#88c8e6',
    alignItems:'center',
  },
  footertouch:{
    position:'absolute',
    width:width/1.2,
    alignItems:'center',
    backgroundColor:'#88c8e6',
    height:width/8.5,
    alignSelf:'center',
    borderRadius: 15,
    bottom:20
  },
  footertext:{
    paddingTop:10,
    color:'#fff',
    textAlign:'center',
    fontSize:18,
    fontWeight:'bold',
    fontFamily:'Din Condensed'
  },
});
export default screen2;
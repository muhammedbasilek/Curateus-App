import React,{Component} from 'react';
import { ScrollView, View,PixelRatio, Text,StyleSheet,Dimensions,StatusBar,Image,ListView,Modal,TextInput,TouchableOpacity, Platform, FlatList, ActivityIndicator, AppState, RefreshControl, Alert,TouchableHighlight, BackHandler, Linking,KeyboardAvoidingView, PermissionsAndroid} from 'react-native';
import { StackNavigator,NavigationActions, TabNavigator,DrawerNavigator } from 'react-navigation';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
var {height, width} = Dimensions.get('window');
import connect from './connect'
import cloneDeep from 'lodash/cloneDeep';

class screen1 extends Component {
   static navigationOptions = ({ navigation }) =>({
    header:null
  });
	constructor(props) {
    super(props);
	    this.state = {
        currentdate:'',
        data:[],
        junk_date:[
                  {day:1},
                  {day:1},
                  {day:1},
                  {day:1},
                  {day:1},
                  {day:1},
                  {day:1},
                  {day:1},
                  ],
        selected_date:'',
        content:'',
        dummy_card_array:[
                    {day:1},
                    {day:1},
                    {day:1},
                    {day:1},
                    {day:1},
                    {day:1},
                    {day:1},
                    {day:1},
                    {day:1},
                      ],
      selected_item:'',
      index_id:'',
      status:''
	   	}

	}
	UNSAFE_componentWillReceiveProps(props) {
 		    
 	}
	componentDidMount() {
    this.getScreen1Data()
	}
  getScreen1Data() {
    let  url = 'http://app.curateus.com/interview/recommend_schedule?type=calendar'
    return fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)
        if(responseJson != undefined){
          this.setState({data:responseJson,selected_date:responseJson[0].day,content:responseJson[0].time},()=>{this.getDataLocal()})
        }else{
          this.setState({data:[]})
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
  getDataLocal = async () => {
    const local_data = await AsyncStorage.getItem('local_data');
    const data = JSON.parse(local_data);
    console.log('local_datadjbh')
    console.log(data)
    if(local_data != null){
      this.setState({data:data,selected_date:data[0].day,content:data[0].time})
    }
  }
  saveDataLocal = async () => {
    try {
        await AsyncStorage.setItem('local_data', JSON.stringify(this.state.data));
      }
      catch(err){
        console.log(err)
      }
  }
  proFun(){ 
    this.getItemId()
  }
  getItemId = async () => {
      const selected_item_d = await AsyncStorage.getItem('selected_item');
      const selected_item = JSON.parse(selected_item_d);
      const index_id_d = await AsyncStorage.getItem('index_id');
      const index_id = JSON.parse(index_id_d);
      let data = cloneDeep(this.state.data)
      let des = {title:''}
      des.title = selected_item
      let items = data.filter(info=>(info.day == this.state.selected_date))[0].time
      items[index_id].content = des
      let total_content = items.filter(info=>info.content != null).length
      data.filter(info=>(info.day == this.state.selected_date))[0].total_content = total_content
      this.setState({data:data,content:data.filter(info=>(info.day == this.state.selected_date))[0].time})
      this.removeValue()
      this.saveDataLocal()
  }
  removeValue = async () => {
      try {
        await AsyncStorage.removeItem('selected_item')
        await AsyncStorage.removeItem('index_id')
      } catch(e) {
        console.log(e)
      }
    }
	render(){
    console.log(this.state.data)
		return( 
      <KeyboardAvoidingView>
			<View style={{paddingTop:(Platform.OS === 'ios') ?20:  0, borderTopColor: 'transparent', borderTopWidth: 4, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white',elevation: 3}}>
      <View style={{paddingTop: 20, padding: 15}}><Image source={ require('../../assets/images/sidemenu.png') } style={{ height:30,width:30 }} /></View>
      <Text style={{backgroundColor:'white', fontSize: 18,padding: 15,fontFamily:'Din Condensed', textAlign: 'center', color: '#000000', paddingRight: 30,marginTop:5}}>Shedule</Text>
      <Text style={{backgroundColor:'white', fontSize: 13, paddingTop: 20,padding: 15,fontFamily:'Din Condensed', textAlign: 'right', color: '#000000'}}></Text>
      </View>
      <View style={styles.container}>
      {this.state.data.length != 0 ?
        <View style={styles.calendar}>
          <ScrollView
            horizontal={true}
            >
            {this.state.data.map((date,index)=>(
              <View>
              {this.state.selected_date != date.day ?
              <View style={styles.date_block}>
              <Text style={{color:'#88c8e6',textAlign:'center',fontSize:15,fontWeight:'bold',fontFamily:'Din Condensed'}}>{date.month_name}</Text>
              <TouchableOpacity onPress={()=>{this.setState({selected_date:date.day,content:date.time})}}>
              <View style={styles.date_circle}>
                <Text style={{fontSize:18,fontWeight:'bold',fontFamily:'Din Condensed',textAlign:'center',color:'#88c8e6'}}>{date.day}</Text>
              </View>
              <Text style={{color:'#88c8e6',textAlign:'center',fontSize:15,fontWeight:'bold',fontFamily:'Din Condensed'}}>{'#'}{date.total_content}</Text>
              </TouchableOpacity>
              </View>
              :
              <View style={styles.date_block}>
              <Text style={{color:'#88c8e6',textAlign:'center',fontSize:15,fontWeight:'bold',fontFamily:'Din Condensed'}}>{date.month_name}</Text>
              <View style={styles.selected_date_block}>
                <Text style={{fontSize:18,fontWeight:'bold',fontFamily:'Din Condensed',textAlign:'center',color:'#fff'}}>{date.day}</Text>
              </View>
              <Text style={{color:'#88c8e6',textAlign:'center',fontSize:15,fontWeight:'bold',fontFamily:'Din Condensed'}}>{'#'}{date.total_content}</Text>
              </View>
              }
              </View>
          ))}
          </ScrollView>
        </View>
        :
        <View style={styles.calendar}>
        <ScrollView 
              horizontal={true}>
        {this.state.junk_date.map((date,index)=>(
          <View style={styles.dummy_date_block}>
          <View style={{marginTop:width/15}}>
            <ActivityIndicator size="small" color="#88c8e6"/>
          </View>
          </View>
          ))}
        </ScrollView>
        </View>
      }
      <View style={{backgroundColor:'#88c8e6',alignSelf:'center',height:height}}>
        <ScrollView>
        {this.state.content && this.state.content.length != 0 ?
          [(this.state.content.map((item,index)=>(
          <View>
          {this.state.content.length == index+1 ?
          <View key={index} style={[styles.card_item,{marginBottom:235}]}>
          <View style={{width:width/5,justifyContent:'center'}}>
            <Text style={{textAlign:'center',color:'#88c8e6',fontFamily:'Din Condensed',fontSize:15}}>{item.time}</Text>
          </View>
          <View style={{width:4*width/5,justifyContent:'center'}}>

            <Text style={{fontSize:16,fontFamily:'Din Condensed',color:'#88c8e6'}}>{item.content && item.content != 'null' ? [(item.content.title.length > 100 ? item.content.title.slice(0,(width/13)*4) +'...' : item.content.title)] : ''}</Text>

          </View>
          <View style={{position:'absolute',right:25,top:25,width:30,height:30,backgroundColor:'#88c8e6',borderRadius:15,justifyContent:'center',elevation:2}}>
            <TouchableOpacity onPress={()=>{item.content && item.content != 'null' ? [(alert('Selected item will be removed from time line. \nAre you sure !!? \n\n#remove api calling...'), this.removeItem(index))] : this.props.navigation.navigate('Screen2',{callHome: this.proFun.bind(this),index_id:index})}}>
            {item.content && item.content != 'null' ?
            <Text style={{textAlign:'center',color:'#fff',fontFamily:'Din Condensed',fontSize:18,fontWeight:'bold'}}>-</Text>
            :
            <Text style={{textAlign:'center',color:'#fff',fontFamily:'Din Condensed',fontSize:18,fontWeight:'bold'}}>+</Text>
            }
            </TouchableOpacity>
          </View>
          </View>
            :
          <View key={index} style={styles.card_item}>
          <View style={{width:width/5,justifyContent:'center'}}>
            <Text style={{textAlign:'center',color:'#88c8e6',fontFamily:'Din Condensed',fontSize:15}}>{item.time}</Text>
          </View>
          <View style={{width:4*width/5,justifyContent:'center'}}>
            <Text style={{fontSize:16,fontFamily:'Din Condensed',color:'#88c8e6'}}>{item.content && item.content != 'null' ? [(item.content.title.length > 100 ? item.content.title.slice(0,(width/13)*4) +'...' : item.content.title)] : ''}</Text>
          </View>
          
          <View style={{position:'absolute',right:25,top:25,width:30,height:30,backgroundColor:'#88c8e6',borderRadius:15,justifyContent:'center',elevation:2}}>
          <TouchableOpacity onPress={()=>{item.content && item.content != 'null' ? [(alert('Selected item will be removed from time line. \nAre you sure !!? \n\n#remove api calling...'), this.removeItem(index))] : this.props.navigation.navigate('Screen2',{callHome: this.proFun.bind(this),index_id:index})}}>
            {item.content && item.content != 'null' ?
            <Text style={{textAlign:'center',color:'#fff',fontFamily:'Din Condensed',fontSize:18,fontWeight:'bold'}}>-</Text>
            :
            <Text style={{textAlign:'center',color:'#fff',fontFamily:'Din Condensed',fontSize:18,fontWeight:'bold'}}>+</Text>
            }
          </TouchableOpacity>
          </View>
          </View>
          }
          </View>
          )))]
          :
          [(this.state.dummy_card_array.map((info,index)=>(
          <View key={index} style={styles.card_item}>

          </View>
          )))]
        }
        </ScrollView>
      </View>
      </View>
      </KeyboardAvoidingView>
			);
	}
  removeItem(index){
    let data = cloneDeep(this.state.data)
    data.filter(info=>(info.day == this.state.selected_date))[0].time[index].content = ''
    let content = cloneDeep(this.state.content)
      content[index].content = ''
      this.setState({content:content,data:data},()=>{this.saveDataLocal()})
    }
}
const styles=StyleSheet.create({
  container:{

  },
  calendar:{
      height:height/5,
      borderBottomColor: '#dadde0',
      borderBottomWidth: 1,
      flexDirection:'row',
      width:width,
      backgroundColor:'#fff',
      elevation: 2
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
  dummy_date_block:{
    width:width/5,
    height:width/5,
    borderRadius:width/10,
    borderWidth:1,
    borderColor:'#88c8e6',
    marginTop:height/10-width/10,
    margin:5
  },
  date_circle:{
    width:width/5,
    height:width/5,
    borderRadius:width/10,
    borderWidth:1,
    borderColor:'#88c8e6',
    justifyContent:'center',
  },
  date_block:{
    justifyContent:'center',
    alignItems:'center',
    alignSelf:'center',
    margin:5
  },
  selected_date_block : {
    width:width/5,
    height:width/5,
    borderRadius:width/10,
    borderWidth:1,
    borderColor:'#88c8e6',
    backgroundColor:'#88c8e6',
    justifyContent:'center'
  },
	card_item:{
    height:80,
    flexDirection:'row',
    borderRadius:10,
    borderWidth:1,
    borderColor:'#88c8e6',
    backgroundColor:'#fff',
    marginTop:5,
    width:width/1.01
  }
});
export default screen1;
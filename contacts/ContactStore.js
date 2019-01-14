import { httpApiUrl, wsApiUrl } from '../core/api';
import React, {Component} from 'react';
import {Provider} from './context';
import {getLogger, issueToText} from "../core/utils";
import {AsyncStorage, NetInfo} from "react-native";
import { Accelerometer } from 'expo';


const log = getLogger('ContactStore');

var mAccel = 0.0;
var mAccelCurrent = 0.0;
var mAccelLast = 0.0;

var newmAccel = 0.0;
var newmAccelCurrent = 0.0;
var newmAccelLast = 0.0;

export class ContactStore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      contacts: null,
      issue: null,
      eTag:null,
      token: null,
      editFunction:this.editContacts,
      load:this.loadContacts.bind(this)
    };
  }

  storeData= async (key,value)=>{
    try{
      await AsyncStorage.setItem(key, JSON.stringify(value));
    }catch(error){
      log(error+ "saving: " + key);
    }
  }

  async retrieveItem(key){
    try{
      const retrievedItem = await AsyncStorage.getItem(key);
      return retrievedItem;
    }catch(error){
      console.log(error.message);
    }
    return;
  }

  componentDidMount() {
    log('componentDidMount');
    NetInfo.addEventListener(
      'connectionChange',
      this.handleConnectivityChange
    );
    

    Promise.all([
      this.retrieveItem('token'),
      this.retrieveItem('contacts'),
      this.retrieveItem('eTag')
    ])
    .then(results => {
      console.log("Contact store aici");
      
      
      if(results[0]!=null)
      {
        this.setState({token: JSON.parse(results[0]).token});
      }

      if(results[1]!=null) 
      {
        console.log("aici")
        console.log(JSON.parse(results[1]))
        this.setState({contacts:JSON.parse(results[1])});
      }

      if(results[2]!=null) 
      {
       
        this.setState({eTag:JSON.parse(results[2])});
      }

      if(this.state.token!=null)
      {  
        this.loadContacts(this.state.eTag);
       // this.connectWs();
      }
      else
      {
        console.log("unauthorized to load contacts");
      }
    
    })
    .catch(() => {
      const error = 'Failed to load one of the resources.';
      this.setState({ error });
  });
    // this.loadContacts();
    // this.connectWs();
  }

  componentWillMount() {
    this._subscribe();
    console.log("register shake shake");

}

  componentWillUnmount() {
    log('componentWillUnmount');
    this._unsubscribe();    
    this.setState({eTag:null,contacts:null,token:null});
    // this.disconnectWs();
  }

  loadContacts = (eTag) => {
    console.log('loadContacts');
    var bearer = 'Bearer '+this.state.token;
    var options =
    {
      'Content-Type': 'application/json',
      'Authorization':bearer
    }

    console.log("am etag");
    console.log(eTag);
    
    // if(eTag!=null)
    // {
      options['If-None-Match']=eTag;
    // }
    console.log(options);

    this.setState({ isLoading: true, issue: null });
    log(httpApiUrl);
    fetch(httpApiUrl+"/contacts",
    {
      method:'GET',
      headers: options
    })
      .then(response => this.handleLoadResponse(response))
      .then(json => this.handleJsonResponse(json))
      .catch(error =>{log(error);this.setState({ isLoading: false, issue: error })});
  };

  editContacts=(id,firstName,lastName,phoneNumber,workNumber)=>{
    console.log("ContactStore: edit contacts");
    var bearer = 'Bearer '+ this.state.token;   
    this.setState({ isLoading: false, issue: null });
    fetch(httpApiUrl+"/contacts",{method:'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': bearer
    },
    body: JSON.stringify({
      FirstName:firstName,
      LastName:lastName,
      PhoneNumber:phoneNumber,
      WorkNumber:workNumber,
      Id:id}),
    })
      .then(response => {
        console.log("edit response");
        console.log(JSON.stringify(response, null, 4))
        this.props.navigation.navigate('Contacts'); 
        this.setState({ isLoading: false});
        this.loadContacts();
      })
      .catch(error =>{
        log(error);
        var newContacts=[];
        this.state.contacts.map((contact)=>{
          if(contact.id == id){
            contact.firstname = firstName;
            contact.lastname = lastName;
            contact.phoneNumber = phoneNumber;
            contact.workNumber = workNumber;
            newContacts.push(contact);
          }
          else{
            newContacts.push(contact);
          }
        });
        this.storeData("contacts",newContacts);
        this.props.navigation.navigate('Contacts'); 

        this.setState({ isLoading: false, issue: error });
      });
  }

  handleLoadResponse(response){
    console.log("handle response")
    if(response.status==200){
      var eTag = response.headers.map.etag;
      log("eTag: "+eTag);
      this.storeData("eTag",eTag);
      this.setState({eTag:eTag});
      return response.json();
    }
    if(response.status == 304){
      this.retrieveItem("contacts").then( ct => {
        this.storeData("contacts",json.contacts);
        this.setState({contacts:ct, isLoading:false});
      })
      
    }
    return "";
  }

  handleJsonResponse(json){
    console.log("handle json",json)
    if(json!=""){
      this.storeData("contacts",json.Contacts);
      this.setState({ contacts: json.Contacts});
    }
    this.setState({isLoading: false });
  }

  handleConnectivityChange=(connection)=>{
    console.log(connection);

    if(connection.type != "none" && connection.type != "unknown" )
    {
        this.updateAllContacts();
    }
  }

  updateAllContacts= ()=>{
    console.log("NetInfo");
    var contacts = this.state.contacts;
    console.log(  JSON.stringify(contacts));
    
    this.state.contacts.map((contact)=>{
      this.editContacts(contact.id,contact.firstname,contact.lastname,contact.phoneNumber,contact.workNumber)
    });
  }


  connectWs = () => {
    const ws = new WebSocket(wsApiUrl);
    ws.onopen = () => {};
    ws.onmessage = e => this.setState({
      contacts: [JSON.parse(e.data).contacts].concat(this.state.contacts || [])
    });
    ws.onerror = e => {};
    ws.onclose = e => {};
    this.ws = ws;
  };

  disconnectWs = () => {
    this.ws.close();
  };

  shuffleArray(array) {
    let i = array.length - 1;
    for (; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  _isShake= (accelerometerData)=>{
    // console.log(accelerometerData);
    let { x, y, z } = accelerometerData.accelerometerData;
    
    newmAccelLast =  mAccelCurrent;
    newmAccelCurrent = Math.sqrt(x*x + y*y + z*z);
    var delta = newmAccelCurrent - newmAccelLast;
    newmAccel = mAccel * 0.9 + delta;
    if (newmAccel > 0.8 && this.state.contacts != null) {
      // console.log("shake shake");
      var contactsN = this.state.contacts.sort((c1,c2)=>{
        if(c1.Lastname > c2.Lastname) { return -1; }
        if(c1.Lastname < c2.Lastname) { return 1; }
        if(c1.Lastname == c2.Lastname){
          if(c1.Firstname > c2.Firstname){
            return -1;
          }
          else if(c1.Firstname < c2.Firstname){
            return 1;
          }
          else{
            return 0;
          }
        }
      });
      this.setState({contacts:contactsN});
  // this.setState({mAccel : newmAccel, mAccelLast : newmAccelLast, mAccelCurrent : newmAccelCurrent})
      
  }
   else{ if (newmAccel > 0.5 && this.state.contacts != null) {
        // console.log("shake shake");
        var contactsN = this.state.contacts.sort((c1,c2)=>{
          if(c1.Lastname < c2.Lastname) { return -1; }
          if(c1.Lastname > c2.Lastname) { return 1; }
          if(c1.Lastname == c2.Lastname){
            if(c1.Firstname < c2.Firstname){
              return -1;
            }
            else if(c1.Firstname > c2.Firstname){
              return 1;
            }
            else{
              return 0;
            }
          }
        });
        //contactsN = this.shuffleArray(contactsN);
        this.setState({contacts:contactsN});
    // this.setState({mAccel : newmAccel, mAccelLast : newmAccelLast, mAccelCurrent : newmAccelCurrent})
        
    }
    mAccel = newmAccel;
    mAccelLast = newmAccelLast;
    mAccelCurrent = newmAccelCurrent;
    // console.log(mAccel);
    
    // console.log("not shake shake")
    
  }
}
  

_subscribe = () => {
    this._subscription = Accelerometer.addListener(accelerometerData => {
      this._isShake({ accelerometerData });
    });
  }

  
  _unsubscribe = () => {
    this._subscription && this._subscription.remove();
    this._subscription = null;
  }


  render() {
    return (
      <Provider value={this.state}>
        {this.props.children}
      </Provider>
    );
  }
}

export default ContactStore;
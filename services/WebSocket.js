import * as signalR from '@aspnet/signalr';
import { HubConnection} from '@aspnet/signalr';
import { httpApiUrl, wsApiUrl } from '../core/api';

export class WebSocketService {
    root = httpApiUrl + '/broadcaster';   
    _connection;
    SendMessage;

    constructor()
    {
        this._connection = new signalR.HubConnectionBuilder()
                        .withUrl(this.root)
                        .configureLogging(signalR.LogLevel.Information)
                        .build();
        this.SendMessage=false;
    }

    getSessionId()
    {
        var sessionId = window.sessionStorage.sessionId;
        
        if (!sessionId)
        {
            sessionId = window.sessionStorage.sessionId = Date.now();
        }
        
        return sessionId;
    }

    async startConnection(groupname)
    {
       await this._connection.start().then(()=>{this.subscribeToAGroup(groupname)});
    }
    
    messageNotification(messageSent) { 
        if(!this.SendMessage)
        {
            this._connection.on('SendMessage', (message) => {
                messageSent(message);
            });
            
            this.SendMessage=true;
        }
    }
    
    subscribeToAGroup(groupname) {
        this._connection.invoke('Subscribe', groupname);
    }

   unsubscribeToAGroup(groupname) {
        this._connection.invoke('Unsubscribe', groupname);
    }
}
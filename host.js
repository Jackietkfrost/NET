//const {Peer} = require("peerjs");
const host = new Peer();
//const host = new Peer();
let conn;
let idInfo;
let connStatus;
let copyId;
let genId;
let connList;
let userName;
let connectedPeers = [];

function playNotifSound(){
    const notifSound = new Audio('assets/sounds/notif_sound.mp3');
    notifSound.play();
    console.log(`Playing sound ${notifSound}`);
    

}

function getUser(){ 
    window.netVar.getUsername();
    window.netVar.getReqUser((event,req) => {
        userName = req;
        console.log("Event Info", event);
        console.log("Our User name is now: ", userName);  
        event.sender.send('send-complete', userName);
    });
}

function addMessage(name, text){
    // When running add message, get list of Connected peer ID's, and send them the message
    
    
    let messageBox = document.getElementsByClassName("message")[0].cloneNode(true);
    messageBox.getElementsByClassName("message-sender")[0].innerHTML = name;
    messageBox.getElementsByClassName("message-text")[0].innerHTML = text;
    document.getElementById("messages").appendChild(message);
    messageBox.scrollIntoView()
}
// Don't think we need this anymore, going to deprecate.
/**
 * @deprecated We no longer need to send messages from the
 * server.
 * @param {*} textInput 
 */
function sendMessage(textInput){
    textInput = document.getElementById("message").value;
    let message =
        {
            name:userName,
            peerID: host.id,
            timestamp: "placeholder date",
            content: textInput
        }
    if(textInput != ""){
        document.getElementById("message").value = "";
        conn.send(message);
        addMessage(userName,textInput);
    }
}

function startHost(){
    host.on('open', function(id) {
        getUser();
        console.log('My peer ID is: ' + id);
        idInfo.value = id;
        host.on('data', function(data) {
            
            console.log('Received', data);
        });
        host.on('connection',function(dataConnection){
            console.log(dataConnection);
            
            //Let's just get the entire data connection data obj.
            //console.log("Connected to Peer ID:" + dataConnection.peer +" .open:" + dataConnection.open + " .reliable:" + dataConnection.reliable + ".label: " + dataConnection.label);
            
            // Change this to display the proper data of who connected, since we're using this panel for the server GUI.
            document.getElementById("connection-status").innerHTML = "Connected";

            //Start adding in all the dataconnection objects into our list
            //so we can refer back to them when sending data we receive
            // TODO: Sanitize and validate data received. (Try and strongtype it later as well.)
            connectedPeers.push(dataConnection);
            
            conn = dataConnection;
            console.log('Metadata: ',dataConnection.metadata);
            dataConnection.on('data', function(data) {
                //addMessage(data.name, data.content);
                playNotifSound();
                console.log("Got data:", data);
              
                // Send data to all connected peers except the sender
                connectedPeers.forEach(function(connection) {
                  if (connection.peer !== dataConnection.peer) {
                    // Send the data through the existing connection
                    connection.send(data);
                  }
                });
              });
              //Change this to show the data of who is connected by metadata.userName + metadata.peerID
            document.getElementById("connection-panel").classList.add("hidden");
            document.getElementById("messaging-panel").classList.remove("hidden");
            
        });

        host.on('disconnected',function(){
            console.log("lost connection");
            document.getElementById("connection-status").innerHTML = "Lost connection";
        });
        host.on('close',function(){
            console.log("lost connection");
            document.getElementById("connection-status").innerHTML = "Lost connection";
        });
    });
}
function listConnections(){
    connList.innerHTML = "connected to" + host.connections.length;
}

function setHostVariables(){
    connStatus = document.getElementById("connection-status");
    copyId = document.getElementById("copy-id");
    genId = document.getElementById("generate-id");
    idInfo = document.getElementById("id-input");
    connList = document.getElementById("connection-list");
}
function addPeerListeners(){
    
    
    genId.addEventListener("click",function(){ 
        window.electronAPI.reloadPage();
    });
    copyId.addEventListener("click",function(){
        if(idInfo.value!='')
        console.log(idInfo.value);
        window.electronAPI.copyText(idInfo.value);
    });
    document.getElementById("disconnect").addEventListener("click",function(){
        sendMessage("$Server: disconnected");
        window.electronAPI.reloadPage();
    });
}

function startServer(){
    setHostVariables();
    startHost();
    addPeerListeners();
}
document.addEventListener("DOMContentLoaded",function(){
    startServer();
})

/*
    On the data received function add in sending the message to all clients except for the one who messaged you initially, this way you can chat with multiple people.

*/
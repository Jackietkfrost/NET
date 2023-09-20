let peer = new Peer();
let conn;
let inputId;
let pasteId;
let connectBtn;
let messageCont;
let userName;
// TODO Add a variable that holds
function getUser(){ 
    window.netVar.getUsername();
    window.netVar.getReqUser((event,req) => {
        userName = req;
        console.log(event);  
        event.sender.send('send-complete', userName);
    });
}

function startPeer(){
    peer.on('open', function(id) {
        getUser();
        console.log(`User name is now: ${userName}`);
        //console.log('My peer ID is: ' + id);
        peer.on('connection',function(dataConnection){
            
            console.log("connected to " + dataConnection.peer);
            document.getElementById("connection-status").innerHTML = "Connected to " + dataConnection.peer;
            dataConnection.send("test");
            console.log("connected to " + dataConnection.peer + " .open:" + dataConnection.open + " .reliable:" + dataConnection.reliable);

        });

        peer.on('error', function(err){
            console.log(err);
        })
        peer.on('close',function(){
            console.log("lost connection");
            document.getElementById("connection-status").innerHTML = "Lost connection";
        });
    });
}

//TODO: Add a function to package a message with a username into a single object containing both objects. 

function playNotifSound(){
    const notifSound = new Audio('assets/sounds/notif_sound.mp3');
    notifSound.play();
    console.log(`Playing sound ${notifSound}`);
    

}

function addMessage(name, content, timestamp){
    window.electronAPI.checkIfFocused(name, content);
    let messageBox = document.getElementsByClassName("message")[0].cloneNode(true);
    messageBox.getElementsByClassName("message-sender")[0].innerHTML = name;
    messageBox.getElementsByClassName("message-text")[0].innerHTML = content;
    messageCont.appendChild(messageBox);
    messageBox.scrollIntoView()
    
}

// TODO: Turn the Send Message function into a separate js file because both host and client do this.
// REVISE
function sendMessage(text){
    let message =
        {
            name:userName,
            peerID: peer.id,
            timestamp: "placeholder date",
            content: text
        }
    if(text != ""){
        document.getElementById("message").value = "";
        conn.send(message);
        addMessage(userName,text);
        
    }

}
function setPeerVariables(){
    connStatus = document.getElementById("connection-status");
    pasteId = document.getElementById("paste-id");
    connectBtn = document.getElementById("connect");
    disconnectBtn = document.getElementById("disconnect");
    inputId = document.getElementById("id-input");
    messageCont = document.getElementById("messages");
}
function addPeerListeners(){
    //let window = remote.getCurrentWindow();
    connectBtn.addEventListener("click",function(){ 
        if(inputId.value!='') {
            console.log('Connecting to peer..');
            conn = peer.connect(inputId.value, {
                metadata:{
                    name:userName,
                    
                }
            });
        
        
        conn.on("open",function(dataConnection){
            console.log("connected");
            //console.log('Metadata:', dataConnection.metadata);
            conn.on("data",function(data){
                
                
                console.log("received ", data);
                
                playNotifSound();
                addMessage(data.name,data.content);
                //addMessage(data.username,data);
            });
            document.getElementById("connection-status").innerHTML = 'Connected';
            document.getElementById("connection-panel").classList.add("hidden");
            document.getElementById("messaging-panel").classList.remove("hidden");
            document.getElementById("disconnect").addEventListener("click",function(){
                sendMessage("$Server: disconnected");
                window.electronAPI.reloadPage();
            });
            document.getElementById("message").addEventListener("keydown",function(e){
                
                if(e.key==="Enter"){
                    let text = document.getElementById("message").value;
                    sendMessage(text);
                }
            });
            document.getElementById("send").addEventListener("click",function(){
                let text = document.getElementById("message").value;
                sendMessage(text);
            });
            sendMessage("$Server: Connected");
        });
    }
    });
    pasteId.addEventListener("click",async function(){
        let pastedValue = await window.electronAPI.pasteText();
        inputId.value = pastedValue;
    });
}


function startServer(){
    setPeerVariables();
    startPeer();
    addPeerListeners();
}
document.addEventListener("DOMContentLoaded",function(){
    startServer();
})
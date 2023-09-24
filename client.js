let peer = new Peer();
let conn;
let peerID;
let inputId;
let pasteId;
let connectBtn;
let messageCont;

/**
 * @param {string} userName - Sending client's user name.
 */
let userName;


/**
 * Retrieves the user information.
 * @todo - Improve this code to be more efficient. It could probably get the username with just the one function (getReqUser)
 * and add a check if the username isn't null, so we only ever do this once. (Better safe than sorry.)
 * @param {type} paramName - description of parameter
 * @return {type} description of return value
 */
function getUser(){ 
    window.netVar.getUsername();
    window.netVar.getReqUser((_event,req) => {
        userName = req;
        //console.log(event);  
        //event.sender.send('send-complete', userName);
    });
}


/**
 * Returns the current timestamp.
 *
 * @namespace {object} timestamp - An object containing the current date and time.
 *     @prop    {string} timestamp.date - The current date in the format "Month Day, Year".
 *     @prop    {string} timestamp.time - The current time in the format "HH:MM AM/PM".
 */
function getTimeStamp(){
    const currDate = new Date();
    let timestamp = {
        date:currDate.toLocaleString(),
        time:currDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    return timestamp;
}

function playNotifSound(){
    const notifSound = new Audio('assets/sounds/notif_sound.mp3');
    notifSound.play();
    console.log(`Playing sound ${notifSound}`);
    

}

/**
 * Displays message to client screen [Visual]
 * @func addMessage(data)
 * @namespace {object} data - contains the information of the message.
 * @prop        {string} data.name - The name of the sender.
 * @prop        {string} data.content - The content of the message.
 * @prop        {string} data.timestamp - The timestamp of the message.
 * @prop        {string} data.content - The content of the message.
 */
function addMessage(data){
    
    window.electronAPI.checkIfFocused(data.name, data.content);
    let messageBox = document.getElementsByClassName("messageBox")[0].cloneNode(true);
    messageBox.getElementsByClassName("message-sender")[0].innerHTML = data.name;
    messageBox.getElementsByClassName("message-text")[0].innerHTML = data.content;
    //TODO: Turn this into a check if time passed is past a day (i.e. 12am), and change the timestamp on the message to the past moment. 
    //(i.e. Yesterday, 10:30pm) and then follow it up with a new date. (i.e. full date format, and hour)
    messageBox.getElementsByClassName("message-timestamp")[0].innerHTML = data.timestamp.time;
    messageCont.appendChild(messageBox);
    messageBox.scrollIntoView()
    
}

// Establishes all the peer emitters.
function startPeer(){
    peer.on('open', function(id) {
        peerID = id;
        getUser();
        console.log(`User name is now: ${userName}`);
        //console.log('My peer ID is: ' + id);

        // Connects to the peer.
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


/**
 * @todo 
 * @param {string} text - Message text being sent from this client
 */
function sendMessage(text){
    let message =
        {
            name: userName,
            peerID: peerID,
            timestamp: getTimeStamp(),
            content: text
        }
    if(text != ""){
        document.getElementById("message").value = "";
        conn.send(message);
        addMessage(message);
        
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

window.netVar.closeConnection(() => {
    conn.disconnect();
});

function addPeerListeners(){
    //let window = remote.getCurrentWindow();
    connectBtn.addEventListener("click",function(){ 
        if(inputId.value!='') {
            console.log('Connecting to peer..');
            conn = peer.connect(inputId.value, {
                metadata:{
                    name:userName,
                    peerID:peerID,
                    uuid:"Test UUID",
                    ip:"127.0.0.1"
                    
                }
            });
        
        
        conn.on("open",function(dataConnection){
            console.log("connected");

            //console.log('Metadata:', dataConnection.metadata);
            conn.on("data",function(data){
                
                
                console.log("[DATA RECEIVED]: ", data);
                
                playNotifSound();
                addMessage(data);
            });
            document.getElementById("connection-status").innerHTML = 'Connected';
            document.getElementById("connection-panel").classList.add("hidden");
            document.getElementById("messaging-panel").classList.remove("hidden");
            document.getElementById("disconnect").addEventListener("click",function(){
                
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
        conn.on("")
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
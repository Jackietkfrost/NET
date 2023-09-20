let peerConnection = new Peer();
let peer = new Peer();
let host = new Peer();
let conn;

function startService(){
    peerConnection.on('open', function(id) {
        // This might be better called on the client.js instead?
        getUser();
        console.log('This Peer ID: ' +id);

        peerConnection.on('connection', function(dataConnection){
            //  Get the connection data including peer ID, if the connection is open, and if the connection is usable.
            console.log("connected to "+ dataConnection.peer +" .open:" + dataConnection.open + " .reliable:"+ dataConnection.reliable + ".label: " + dataConnection.label);

            // Handle Data Connection related events.
                // Data Management
                // data should be an object with a name and content, and a timestamp.
            dataConnection.on('data',function(data){
                addMessage(data.name, data.content);
            })

            // Handle Connection begin
            // should send a notification to host service that a connection has been established.
            dataConnection.on('open',function(){
                //Let host service know that a connection has been established.
                // i.e. peerConnection.send()
            })

            dataConnection.on('close',function(){
                // Let ourselves know that our connection has been closed.
            })

            dataConnection.on('error',function(){
                // Make an error notification
            })
        })

    })
}

function stopService(){
    peerConnection.on('close', function(){
        console.log("Connection ended.");
    })
}

function handleServiceError(){
    peerConnection.on('error', function(){
        
    })
}

// Functionality to send messages between clients. Host should be able to send messages to clients.
function sendMessage(text){
    let message =
        {
            name:userName,
            peerID: "Peer ID: "+peer.id,
            timestamp: "placeholder date",
            content: text
        }
        //If the message isn't 
    if(text != ""){
        conn.send(message);
        addMessage(userName,text);
        
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
            console.log("connected to "+dataConnection.peer+" .open:" + dataConnection.open+ " .reliable:"+dataConnection.reliable);
            document.getElementById("connection-status").innerHTML = "Connected";
            conn = dataConnection;

            dataConnection.on('data',function(data){
                addMessage(data.name, data.content);
                console.log("got data: "+ JSON.parse(data));
            });

            document.getElementById("connection-panel").classList.add("hidden");
            document.getElementById("messaging-panel").classList.remove("hidden");
            document.getElementById("message").addEventListener("keydown",function(e){
                if(e.key==="Enter"){
                    sendMessage(text);
                }
            });
            document.getElementById("send").addEventListener("click",function(){
                sendMessage(text);
            });
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

function startPeer(){
    peer.on('open', function(id) {
        getUser();
        console.log(`User name is now: ${userName}`);
        //console.log('My peer ID is: ' + id);
        peer.on('connection',function(dataConnection){
            console.log("connected to "+ dataConnection.peer);
            document.getElementById("connection-status").innerHTML = "Connected to "+ dataConnection.peer;
            dataConnection.send("test");
            console.log("connected to "+dataConnection.peer+" .open:" + dataConnection.open + " .reliable:"+ dataConnection.reliable);

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

function addPeerListeners(){
    //let window = remote.getCurrentWindow();
    connectBtn.addEventListener("click",function(){ 
        if(inputId.value!='') {
            console.log('Connecting to peer..');
            conn = peer.connect(inputId.value, {
                metadata:{
                    //Consider implementing username
                    //name:userName,
                    uuid:"Test UUID",
                    profile_pic:"TEST_INFO",
                    
                }
            });
        
        
        conn.on("open",function(dataConnection){
            console.log("connected");
            conn.on("data",function(data){
                
                
                console.log("received "+ data);
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

module.exports = {
    startHost,
    startPeer,
    addPeerListeners,
}
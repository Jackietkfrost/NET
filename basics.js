
function loadListeners(){
    document.getElementById("close").addEventListener("click",function(){
        window.titlebar.closeWindow();
        console.log('Sending event?');
    });
    
    document.getElementById("minimize").addEventListener("click",function(){
        window.titlebar.minWindow();
    });
    
    document.getElementById("maximize").addEventListener("click",function(){
        window.titlebar.maxWindow();
    });
    
    
}

function start(){
    loadListeners();
}
document.addEventListener("DOMContentLoaded",function(){
    start();
    let userBox = document.getElementById('user-info');
    if(userBox) {
        userBox.addEventListener("focusout", function(){
            window.netVar.setUsername(userBox.value);
        })
    }
})
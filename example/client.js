var socket = require('socket.io-client')('http://127.0.0.1:3000/cmd');
socket.on('connect', function(clt){
    console.log("connect")
    socket.on('upInfo', function(s)
    {
        console.log(s);
    });
    socket.emit("r","whoami;id");
});
socket.on('event', function(data)
{
    console.log(data)
});
socket.on('disconnect', function(){
    console.log("disconnect")
});
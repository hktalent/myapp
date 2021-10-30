var myapp = require('myapp_51pwn'),
    serverRootPath = __dirname + "/../",
    szSSP = serverRootPath + "static/";

var oMyapp = new myapp({
    serverRootPath:serverRootPath,
    webStaticPath:szSSP,
    singleIpMaxConnect:30,
    useHttps:false,
    port:3000,
    wtHosts:["127.0.0.1:3000"],
    redisAdapter:{ host: '127.0.0.1', port: 6379 },
    cbk4ServerAppIo:function(server,app,io)
    {
        // do cmd
        require(__dirname + '/sDoCmd').myCmd(app,io.of("/cmd"));
    },
    onLog:function(s)
    {
        console.log(s);
    },
    onError:function(s)
    {
        console.log(s);
    }
});

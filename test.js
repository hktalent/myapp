var myapp = require('/mytools/myapp/index.js'),
    serverRootPath = "/mytools/hktools_MTX/app/",
    szSSP = serverRootPath + "static/";

var oMyapp = new myapp({
    serverRootPath:serverRootPath,
    webStaticPath:szSSP,
    singleIpMaxConnect:30,
    useHttps:false,
    port:3000,
    // caKey:,
    // caCert:,
    wtHosts:["51pwn.com","www.51pwn.com","exploit-poc.com","www.exploit-poc.com"],
    redisAdapter:{ host: '127.0.0.1', port: 6379 },
    cbkApp:function(app)
    {
        app.get(/\/:[^\.\? ]+/, (req, res) => res.sendFile(szSSP + '/p2pchat.html'));
    },
    cbk4AppIo:function(server,app,io)
    {
        // 开启webssh
        require(szSSP + '/ssh').mySSH(app,io.of("/s_s-hX"));
        // win远程桌面
        require(szSSP + '/mstsc')(server,io.of("/r_dpX"));
        /*///////////////////////
    https://github.com/vasanthv/hello
    https://github.com/peers/peerjs-server
    https://github.com/anoek/webrtc-group-chat-example
    https://github.com/pubnub/SimpleRTC
    https://github.com/voximplant/videochat/tree/master/WebApp
    https://github.com/webrtc/apprtc
    /////////////////*/
        require(szSSP + '/p2pchat').fnInit(io.of("/pChat"));
    },
    onLog:function(s)
    {
        console.log(s);
    }
});

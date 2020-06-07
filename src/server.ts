import errorHandler from "errorhandler";

import app from "./app";
import * as socketio from "socket.io";

/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler());
/**
 * Start Express server.
 */
let http = require("http").Server(app);

let io = require("socket.io")(http);

io.on('connection', function(client: any) {
    console.log('Client connected...');
    client.on('join', function(data: any) {
       console.log(data);
    });
});

const server = http.listen(app.get("port"), () => {
    console.log(
        "  App is running at http://localhost:%d in %s mode",
    app.get("port"),
    app.get("env")
    );
    console.log("  Press CTRL-C to stop\n");
});

export default server;

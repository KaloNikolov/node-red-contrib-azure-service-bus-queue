var azure = require("azure-sb");

module.exports = function(RED) {
    function ReceiveMessage(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        var d = new Date().toISOString();
        node.log("receive-message node created.");

        var serviceBusService = azure.createServiceBusService(config.connectionString);

        var state = { isClosed: false };

        node.on("close", function(done) {
            node.log("Closing " + d + " - " + node.id);
            state.isClosed = true;
            done();
        });

        var checkForMessage = function() {

            node.log("Waiting for Message " + d);

            if(state.isClosed){
                node.log("Exiting... " + d);
                return;
            }

            node.status({});
            serviceBusService.receiveQueueMessage(config.queue, {timeoutIntervalInS: 180}, function(error, receivedMessage){
                if(error){
                    if(error !== "No messages to receive") {
                        node.error(error);
                        node.status({ fill: "yellow", shape: "ring", text: "error received, see debug or output" });
                    }
                } else {
                    var msg = receivedMessage.body;
                    try{
                        msg = JSON.parse(msg);
                    } catch(err) {}
                    
                    node.status({ fill: "green", shape: "ring", text: "got a message" });
                    node.send({payload: msg});
                }
                checkForMessage();
            });
        }

        if(!node.listen)
        {
            node.listen = true;        
            checkForMessage();
        }
    }
    RED.nodes.registerType("receive-message",ReceiveMessage);
}
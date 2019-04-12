var azure = require("azure-sb");

module.exports = function(RED) {
    function ReceiveMessage(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        var serviceBusService = azure.createServiceBusService(config.connectionString);

        var checkForMessage = function() {
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
        checkForMessage();
    }
    RED.nodes.registerType("receive-message",ReceiveMessage);
}

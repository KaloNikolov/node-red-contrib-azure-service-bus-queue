var azure = require("azure-sb");

module.exports = function(RED) {
    function SendMessage(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        var serviceBusService = azure.createServiceBusService(config.connectionString);

        node.on('input', function(msg) {
            var msgString = JSON.stringify(msg.payload);

            serviceBusService.sendQueueMessage(config.queue, msgString, function(err, msgRes){
                if(err){
                    node.status({ fill: "red", shape: "ring", text: "error, see debug or output" });
                    node.error(err);
                } else {
                    node.status({ fill: "blue", shape: "ring", text: "sent a message" });
                    setTimeout(()=>{ node.status({}); }, 2000);
                }
            });

            node.send(msg);
        });
    }
    RED.nodes.registerType("post-message",SendMessage);
}
var azure = require("azure-sb");

module.exports = function(RED) {
    function SendMessage(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        var serviceBusService = azure.createServiceBusService(config.connectionString);

        node.on('input', function(msg) {
            var msgString = JSON.stringify(msg.payload);

            serviceBusService.sendQueueMessage(config.queue, msgString, function(err, msgRes){});

            node.send(msg);
        });
    }
    RED.nodes.registerType("post-message",SendMessage);
}
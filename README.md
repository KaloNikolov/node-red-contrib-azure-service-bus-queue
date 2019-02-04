# node-red-contrib-azure-service-bus-queue

A simple node-red package that allows you to post and recieve Azure Service Bus Queue messages 

The post-message node requires configuration - the name of the queue to post in and the Azure Service bus queue ConnectionString. It posts the JSON object located in the msg.payload input message. 

The receive-message node requires configuration - the Azure Service bus queue ConnectionString. The node returns JSON object in the msg.payload property. 


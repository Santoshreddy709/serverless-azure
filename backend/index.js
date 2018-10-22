const mongo = require("mongodb").MongoClient;

module.exports = function(context, req) {
  context.log("create client function processing request");
  context.log("req.body", req.body);
  if (req.body) {
    let clientData = req.body;
    //connect to Mongo and list the items
    mongo.connect(
      process.env.cosmos_Connect_String,
      (err, client) => {
        context.log(err);
        context.log(client);
        let send = response(client, context);
        if (err) send(500, err.message);
        let db = client.db("tnpsitesurvey");
        db.collection("surveytable").insertOne(clientData, (err, clientData) => {
          if (err) send(500, err.message);

          send(200, clientData);
        });
      }
    );
  } else {
    context.res = {
      status: 400,
      body: "Please pass data in the body"
    };
  }
};

//Helper function to build the response
function response(client, context) {
  return function(status, body) {
    context.res = {
      status: status,
      body: body
    };

    client.close();
    context.done();
  };
}
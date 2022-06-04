const streams = require("../node/streams");

streams.set_panic_hook();

main()
  .then(() => {
    console.log("Done example");
  })
  .catch((err) => {
    console.log(err);
  });


async function main() {
  // Default is a load balancer, if you have your own node it's recommended to use that instead
  let node = "https://chrysalis-nodes.iota.org/";
  
  // Options include: (node-url, local pow)
  var options = new streams.SendOptions(node, true);

// Create our own client
  const client = await new streams.ClientBuilder()
    .node(node)
    .build();
    
  // We create an author for this channel
    
  var seed = make_seed(81);
  var auth = streams.Author.fromClient(streams.StreamsClient.fromClient(client), seed, streams.ChannelType.SingleBranch);

  console.log("channel address: ", auth.channel_address());
  console.log("multi branching: ", auth.is_multi_branching());
  console.log("IOTA client info:", await client.getInfo());


  let response = await auth.clone().send_announce();
  let ann_link = response.link;
  console.log("announced at: ", ann_link.toString());
  console.log("Announce message index: " + ann_link.toMsgIndexHex());
// ----- Author Creation is done ------


  let details = await auth.clone().get_client().get_link_details(ann_link);
  console.log("Announce message id: " + details.get_metadata().message_id);

// We create a subscriber to interact within this channel

  let seed2 = make_seed(81);
  let sub = new streams.Subscriber(seed2, options.clone());
  // ann_link del autor, creacion y adjuntacion del usuario al canal
  await sub.clone().receive_announcement(ann_link.copy());

  let author_pk = sub.author_public_key();
  console.log("Channel registered by subscriber, author's public key: ", author_pk);


  // copy state for comparison after reset later
  let start_state = sub.fetch_state();


// Subscripcion del usuario encargado de mandar los mensajes
  console.log("Subscribing...");
  response = await sub.clone().send_subscribe(ann_link.copy());
  let sub_link = response.link;
  //link to be provided to the author for subscription
  
  console.log("Subscription message at: ", sub_link.toString());
  console.log("Subscription message index: " + sub_link.toMsgIndexHex());

  //author accepts and processes subscription
  await auth.clone().receive_subscribe(sub_link.copy());
  console.log("Subscription processed");


// Keyload to all participants in the channel

  console.log("Sending Keyload");
  response = await auth.clone().send_keyload_for_everyone(ann_link.copy());
  let keyload_link = response.link;
  console.log("Keyload message at: ", keyload_link.toString());
  console.log("Keyload message index: " + keyload_link.toMsgIndexHex());

  console.log("Subscriber syncing...");
  await sub.clone().syncState();

// Sending a message

  let public_payload = to_bytes("Public");
  let masked_payload = to_bytes("Masked");

  console.log("Subscriber Sending tagged packet");
  response = await sub.clone().send_tagged_packet(keyload_link, public_payload, masked_payload);
  let tag_link = response.link;
  console.log("Tag packet at: ", tag_link.toString());
  console.log("Tag packet index: " + tag_link.toMsgIndexHex());

  let last_link = tag_link;
  
  // signed packet
  // Resultado del ejercicio
 
  console.log("Informacion Bombilla");

  let public2_payload = to_bytes("Estado Bombilla");
let counter = 1;

while(true){

  for (var x = 0; x < 10; x++) {   
    var random_boolean_value = Math.random() < 0.5;
    var registro = new Date().toISOString().split('T')[0];
    var hour = new Date().getHours();
    var minute = new Date().getMinutes();
    var fecha = hour + ':' + minute + ' / ' + registro
    let public_payload = to_bytes("Estado Bombilla " + 'Esta encendida?' + random_boolean_value);
    let masked_payload = to_bytes("timestamp: " + fecha);
    let masked2_payload = to_bytes(JSON.stringify({'Esta encendida?': random_boolean_value , 'timestamp': fecha}));
    let time_before = Date.now()/1000;
    console.log('Timestamp de packet has been sent: ' + time_before); 
    response = await sub
      .clone()
      .send_signed_packet(last_link, public2_payload, masked2_payload);
    last_link = response.link;
    console.log("Signed packet at: ", last_link.toString());
    console.log("Signed packet index: " + last_link.toMsgIndexHex());
    //console.log("Signed packet ID: " + last_link.msgId);
    //console.log("Signed packet: " + last_link.toMsgIndex());

    console.log("\nAuthor fetching next messages");
    for (const msg of await auth.clone().fetchNextMsgs()) {
      console.log("Found a message...");
      console.log(
        "Public: ",
        from_bytes(msg.message.get_public_payload()),
        "\tMasked: ",
        from_bytes(msg.message.get_masked_payload())
      );
      let time_after = Date.now()/1000;
     console.log('Timestamp de packet has been received: ' + time_after); 
     	    var difference = time_after - time_before;
	    var secondsDifference = Math.floor(difference);
	console.log('difference = ' + secondsDifference + ' second/s ');
	console.log('We have ' + counter + ' messages');
	counter = counter + 1;
    }


}

}

  console.log("\nSub sending unsubscribe message");
  response = await sub.clone().send_unsubscribe(sub_link);
  await auth.clone().receive_unsubscribe(response.link);
  console.log("Author received unsubscribe and processed it");
  
  // Check that the subscriber is no longer included in keyloads following the unsubscription
  console.log("\nAuthor sending new keyload to all subscribers");
  response = await auth.clone().send_keyload_for_everyone(ann_link.copy());
  if (await sub.clone().receive_keyload(response.link)) {
    console.log("unsubscription unsuccessful");
  } else {
    console.log("unsubscription successful");
  }

  function to_bytes(str) {
    var bytes = [];
    for (var i = 0; i < str.length; ++i) {
      bytes.push(str.charCodeAt(i));
    }
    return bytes;
  }

  function from_bytes(bytes) {
    var str = "";
    for (var i = 0; i < bytes.length; ++i) {
      str += String.fromCharCode(bytes[i]);
    }
    return str;
  }

  function make_seed(size) {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    let seed = "";
    for (i = 9; i < size; i++) {
      seed += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return seed;
  }
}

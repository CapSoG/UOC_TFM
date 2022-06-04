async function run() {
    const { ClientBuilder } = require('@iota/client');
    
    let node = "https://chrysalis-nodes.iota.org/";

    // client will connect to testnet by default
    const client = new ClientBuilder()
    .node(node)
    .build();

    client.getInfo().then(console.log).catch(console.error);

   // client will connect to testnet by default

    const message_data = await client.getMessage().data("2c7df1532155fed1a862b9f246a148cc0e7b3adbf815d27fb96240d7edd73519");
    console.log(message_data);
    
    // get indexation data by index
    const message_raw = await client.getMessage().raw("2c7df1532155fed1a862b9f246a148cc0e7b3adbf815d27fb96240d7edd73519");
    console.log(message_raw);
}

run()

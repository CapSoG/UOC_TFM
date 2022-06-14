async function run() {
    const { ClientBuilder } = require('@iota/client');
    
    let node = "https://chrysalis-nodes.iota.org/";

    // Cliente se conecta al nodo de la mainnet sino por defecto se conecta a la testnet
    const client = new ClientBuilder()
    .node(node)
    .build();

    client.getInfo().then(console.log).catch(console.error);

   // Recuperamos los datos del mensaje

    const message_data = await client.getMessage().data("1130dc8304020253b66c70efd1f64aa17e7df866b3de457cd185525313d7681f");
    console.log(message_data);
    
    // Recuperamos los datos del mensaje sin procesar para que podamos analizar el numero de bytes
    const message_raw = await client.getMessage().raw("1130dc8304020253b66c70efd1f64aa17e7df866b3de457cd185525313d7681f");
    console.log(message_raw);
}

run()

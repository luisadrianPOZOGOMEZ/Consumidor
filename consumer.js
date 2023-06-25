const amqp = require('amqplib')

const rabbitSettings = {
    protocol: 'amqp',
    hostname: 'localhost',
    port: 5672,
    username: 'guest',
    password: 'guest'
}
async function connect() {
    const queue = "estafeta"
    try {
        const conn = await amqp.connect(rabbitSettings);
        console.log('Conexión exitosa')
        const channel = await conn.createChannel()
        console.log ("Canal creado exitosamente")

        channel.consume(queue, (msn)=> {
            console.log(msn.content.toString())
            channel.ack(msn)
        })
        

    } catch (error) {
        console.error('Error => ', error)    
    }
}

connect();
import amqp from "amqplib";
import fetch from "node-fetch";

const rabbitSettings = {
  protocol: "amqp",
  hostname: "3.220.100.252",
  port: 5672,
  username: "pozodev",
  password: "24LN112003",
};

async function connect() {
  const queue = "event-initial";
  try {
    const conn = await amqp.connect(rabbitSettings);
    console.log("Conexión exitosa");
    const channel = await conn.createChannel();
    console.log("Canal creado exitosamente");

    channel.consume(queue, async (msn) => {
      const data = msn.content.toString();
      console.log("Recibido: ", data);
      const product = JSON.parse(data);

      // Envío del objeto user a la API para guardar usuarios
      try {
        const response = await fetch("http://44.216.17.250:3000/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(product),
        });
        if (response.ok) {
          console.log("Usuario guardado correctamente");
        } else {
          console.error("Error al guardar usuario");
        }
      } catch (error) {
        console.error("Error en el fetch: ", error);
      }

      channel.ack(msn);
    });

  } catch (error) {
    console.error("Error => ", error);
  }
}

connect();
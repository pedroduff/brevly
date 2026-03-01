import { Kafka } from 'kafkajs';

const TOPIC = 'shortlink.access';

export interface ShortLinkAccessPublisher {
  publish(slug: string): Promise<void>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}

export function createAccessProducer(): ShortLinkAccessPublisher {
  const brokers = process.env.KAFKA_BROKERS;
  if (!brokers) {
    return {
      async publish() {},
      async connect() {},
      async disconnect() {},
    };
  }
  const kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID ?? 'brevly-server',
    brokers: brokers.split(',').map((b: string) => b.trim()),
  });
  const producer = kafka.producer();

  return {
    async connect() {
      await producer.connect();
    },
    async disconnect() {
      await producer.disconnect();
    },
    async publish(slug: string) {
      await producer.send({
        topic: TOPIC,
        messages: [{ value: JSON.stringify({ slug }) }],
      });
    },
  };
}

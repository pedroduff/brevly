import { Kafka } from 'kafkajs';
import type { IncrementAccessCountUseCase } from '../../application/modules/shortLink/useCases/incrementAccessCount.useCase.js';

const TOPIC = 'shortlink.access';
const GROUP = 'brevly-access-increment';

export async function startAccessConsumer(
  incrementAccessCount: IncrementAccessCountUseCase,
) {
  const brokers = process.env.KAFKA_BROKERS;
  if (!brokers) return;

  const kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID ?? 'brevly-server',
    brokers: brokers.split(',').map((b: string) => b.trim()),
  });
  const consumer = kafka.consumer({ groupId: GROUP });
  await consumer.connect();
  await consumer.subscribe({ topic: TOPIC });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const value = message.value?.toString();
      if (!value) return;
      try {
        const { slug } = JSON.parse(value) as { slug?: string };
        if (slug) await incrementAccessCount.execute(slug);
      } catch {
        // skip invalid messages
      }
    },
  });
}

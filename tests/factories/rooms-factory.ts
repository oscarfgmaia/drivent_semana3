import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createRoom() {
  return prisma.room.create({
    data: {
      name: faker.name.firstName(),
      capacity: parseInt(faker.random.numeric(1)),
      hotelId: 1,
    },
  });
}

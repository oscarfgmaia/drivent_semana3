import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createHotel() {
  await prisma.$queryRaw`ALTER SEQUENCE "Hotel_id_seq" RESTART WITH 1`;
  return prisma.hotel.create({
    data: {
      name: faker.name.firstName(),
      image: faker.image.business(),
    },
  });
}

import faker from "@faker-js/faker";
import { prisma } from "@/config";

export async function createRoom(hotelId: number) {
  return prisma.room.create({
    data: {
      name: "Room "+faker.name.firstName(),
      capacity: faker.datatype.number({ min: 1, max: 5 }),
      hotelId,
    },
  });
}

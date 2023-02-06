import faker from "@faker-js/faker";
import { prisma } from "@/config";

export async function createHotel() {
  return prisma.hotel.create({
    data: {
      name: "Hotel "+faker.name.firstName(),
      image: faker.image.business(),
    },
  });
}

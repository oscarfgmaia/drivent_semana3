import supertest from 'supertest';
import httpStatus from 'http-status';
import app, { init, close } from '@/app';
import faker from '@faker-js/faker';
import { createUser, createHotel, createRoom } from '../factories';
import * as jwt from 'jsonwebtoken';
import { cleanDb, generateValidToken } from '../helpers';
import { prisma } from '@/config';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
  await prisma.$queryRaw`ALTER SEQUENCE "Hotel_id_seq" RESTART WITH 1`;
});

afterAll(async () => {
  await close();
});

const server = supertest(app);

describe('GET /hotels', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/hotels');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 404 when there are no hotels created', async () => {
      const token = await generateValidToken();
      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 200 and an array with existing data', async () => {
      const token = await generateValidToken();
      await createHotel();
      await createHotel();
      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            image: expect.any(String),
          }),
        ]),
      );
      expect(response.status).toBe(httpStatus.OK);
    });
  });
});

import { notFoundError, unauthorizedError } from '@/errors';

async function getHotels(ticketId: number, userId: number) {
}

async function getHotelById(ticketId: number, userId: number) {
}

const hotelService = {
  getHotels,
  getHotelById,
};

export default hotelService;

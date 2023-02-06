import { notFoundError, paymentError, unauthorizedError } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import hotelRepository from '@/repositories/hotel-repository';
import ticketRepository from '@/repositories/ticket-repository';

async function getHotels() {
  const hotels = await hotelRepository.getHotels();
  if (!hotels) {
    throw notFoundError();
  } else {
    return hotels;
  }
}

async function getHotelById(hotelId: number, userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) {
    throw notFoundError();
  }
  const hotel = await hotelRepository.getHotelById(hotelId);
  if (!hotel) {
    throw notFoundError();
  }

  if (
    ticket.status === 'RESERVED' ||
    ticket.TicketType.isRemote === true ||
    ticket.TicketType.includesHotel === false
  ) {
    throw paymentError();
  }
  return hotel;
}

const hotelService = {
  getHotels,
  getHotelById,
};

export default hotelService;

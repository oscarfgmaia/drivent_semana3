import { notFoundError, paymentError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelRepository from "@/repositories/hotel-repository";
import ticketRepository from "@/repositories/ticket-repository";

async function getHotels(userId: number) {
  await validRegistration(userId);
  const hotels = await hotelRepository.getHotels();
  if (hotels.length === 0) {
    throw notFoundError();
  } else {
    return hotels;
  }
}

async function getHotelById(hotelId: number, userId: number) {
  await validRegistration(userId);
  const hotel = await hotelRepository.getHotelById(hotelId);
  if (!hotel || hotel.Rooms.length === 0) {
    throw notFoundError();
  }
  return hotel;
}

async function validRegistration(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) {
    throw notFoundError();
  }
  if (
    ticket.status === "RESERVED" ||
    ticket.TicketType.isRemote === true ||
    ticket.TicketType.includesHotel === false
  ) {
    throw paymentError();
  }
}

const hotelService = {
  getHotels,
  getHotelById,
};

export default hotelService;

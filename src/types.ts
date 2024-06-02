export enum RoomType {
  Deluxe = "Deluxe",
  Standard = "Standard",
  Suite = "Suite",
  Single = "Single",
  Double = "Double",
}

export interface Room {
  id: string;
  roomType: RoomType;
  bedType: string;
  capacity: number;
  pricePerNight: number;
  amenities: string[];
}

export type Rooms = Room[];

export interface Booking {
  id: string;
  guestName: string;
  checkInDate: string; // Using ISO 8601 date format: YYYY-MM-DD
  checkOutDate: string;
  roomType: RoomType;
  roomId: string; // Add this line
  numberOfGuests: number;
  specialRequests?: string;
}

export type Bookings = Booking[];

export interface GuestName {
  first_name: string;
  last_name: string;
}

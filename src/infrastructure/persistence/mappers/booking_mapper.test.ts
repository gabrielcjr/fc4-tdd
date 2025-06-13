import { Booking } from "../../../domain/entities/booking";
import { Property } from "../../../domain/entities/property";
import { User } from "../../../domain/entities/user";
import { DateRange } from "../../../domain/value_objects/date_range";
import { BookingEntity } from "../entities/booking_entity";
import { PropertyEntity } from "../entities/property_entity";
import { UserEntity } from "../entities/user_entity";
import { BookingMapper } from "../mappers/booking_mapper";

describe("BookingMapper", () => {
  it("deve converter BookingEntity em Booking corretamente", () => {
    const userEntity = new UserEntity();
    userEntity.id = "1";
    userEntity.name = "John Doe";

    const propertyEntity = new PropertyEntity();
    propertyEntity.id = "1";
    propertyEntity.name = "Condo";
    propertyEntity.description = "Nice Condo in Downtown";
    propertyEntity.maxGuests = 5;
    propertyEntity.basePricePerNight = 200;

    const bookingEntity = new BookingEntity();
    bookingEntity.id = "1";
    bookingEntity.property = propertyEntity;
    bookingEntity.guest = userEntity;
    bookingEntity.startDate = new Date("2024-12-20");
    bookingEntity.endDate = new Date("2024-12-25");
    bookingEntity.guestCount = 2;
    bookingEntity.totalPrice = 100.0;
    bookingEntity.status = "CONFIRMED";
    const booking = BookingMapper.toDomain(bookingEntity);

    expect(booking.getId()).toBe("1");
    expect(booking.getProperty().getId()).toBe(propertyEntity.id);
    expect(booking.getUser().getId()).toBe(userEntity.id);
    expect(booking.getGuestCount()).toBe(2);
  });

  it("deve lançar erro de validação ao faltar campos obrigatórios no BookingEntity", () => {
    const userEntity = new UserEntity();
    userEntity.id = "1";
    userEntity.name = "John Doe";

    const propertyEntity = new PropertyEntity();
    propertyEntity.id = "1";
    propertyEntity.name = "Condo";
    propertyEntity.description = "Nice Condo in Downtown";
    propertyEntity.maxGuests = 5;
    propertyEntity.basePricePerNight = 200;

    const bookingEntity = new BookingEntity();
    bookingEntity.id = "1";
    bookingEntity.property = propertyEntity;
    bookingEntity.guest = userEntity;
    bookingEntity.startDate = new Date("2024-12-20");
    bookingEntity.endDate = new Date("2024-12-25");
    bookingEntity.guestCount = 0;
    bookingEntity.totalPrice = 100.0;
    bookingEntity.status = "CONFIRMED";
    expect(() => BookingMapper.toDomain(bookingEntity)).toThrow(
      "O número de hóspedes deve ser maior que zero."
    );
  });

  it("deve retornar erros quando as datas estão inválidas", () => {
    const userEntity = new UserEntity();
    userEntity.id = "1";
    userEntity.name = "John Doe";

    const propertyEntity = new PropertyEntity();
    propertyEntity.id = "1";
    propertyEntity.name = "Condo";
    propertyEntity.description = "Nice Condo in Downtown";
    propertyEntity.maxGuests = 5;
    propertyEntity.basePricePerNight = 200;

    const bookingEntity = new BookingEntity();
    bookingEntity.id = "1";
    bookingEntity.property = propertyEntity;
    bookingEntity.guest = userEntity;
    bookingEntity.startDate = new Date("2024-12-20");
    bookingEntity.endDate = new Date("2024-12-19");
    bookingEntity.guestCount = 0;
    bookingEntity.totalPrice = 100.0;
    bookingEntity.status = "CONFIRMED";
    expect(() => BookingMapper.toDomain(bookingEntity)).toThrow(
      "A data de término deve ser posterior à data de início."
    );
  });

  it("deve criar uma instância de Booking com propriedade nos argumentos", () => {
    const property = new Property("1", "Condo 2", "Brand New Condo", 3, 200);
    const userEntity = new UserEntity();
    userEntity.id = "1";
    userEntity.name = "John Doe";

    const bookingEntity = new BookingEntity();
    bookingEntity.id = "1";
    bookingEntity.guest = userEntity;
    bookingEntity.startDate = new Date("2024-12-20");
    bookingEntity.endDate = new Date("2024-12-25");
    bookingEntity.guestCount = 2;
    bookingEntity.totalPrice = 100.0;
    bookingEntity.status = "CONFIRMED";
    const booking = BookingMapper.toDomain(bookingEntity, property);

    expect(booking.getId()).toBe("1");
    expect(booking.getProperty().getId()).toBe(property.getId());
    expect(booking.getUser().getId()).toBe(userEntity.id);
    expect(booking.getGuestCount()).toBe(2);
  });

  it("deve converter Booking para BookingEntity corretamente", () => {
    const property = new Property("1", "Condo 2", "Brand New Condo", 3, 200);
    const user = new User("1", "John Doe");
    const dateRange = new DateRange(
      new Date("2024-12-20"),
      new Date("2024-12-25")
    );

    const bookingInstance = new Booking("1", property, user, dateRange, 2);
    const booking = BookingMapper.toPersistence(bookingInstance);

    expect(booking.id).toBe("1");
    expect(booking.property.id).toBe(property.getId());
    expect(booking.guest.id).toBe(user.getId());
    expect(booking.guestCount).toBe(2);
  });
});

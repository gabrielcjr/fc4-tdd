import { Booking } from "../../../domain/entities/booking";
import { Property } from "../../../domain/entities/property";
import { User } from "../../../domain/entities/user";
import { DateRange } from "../../../domain/value_objects/date_range";
import { BookingEntity } from "../entities/booking_entity";
import { PropertyEntity } from "../entities/property_entity";
import { UserEntity } from "../entities/user_entity";
import { BookingMapper } from "../mappers/booking_mapper";
import { PropertyMapper } from "./property_mapper";

describe("PropertyMapper", () => {
  it("deve converter PropertyEntity em Property corretamente", () => {
    const propertyEntity = new PropertyEntity();
    propertyEntity.id = "1";
    propertyEntity.name = "Condo";
    propertyEntity.description = "Nice Condo in Downtown";
    propertyEntity.maxGuests = 5;
    propertyEntity.basePricePerNight = 200;

    const property = PropertyMapper.toDomain(propertyEntity);

    expect(property.getId()).toBe("1");
    expect(property.getName()).toBe(propertyEntity.name);
    expect(property.getDescription()).toBe(propertyEntity.description);
    expect(property.getMaxGuests()).toBe(propertyEntity.maxGuests);
    expect(property.getBasePricePerNight()).toBe(
      propertyEntity.basePricePerNight
    );
  });

  it("deve lançar erro de validação ao faltar campos obrigatórios no PropertyEntity", () => {
    const propertyEntity = new PropertyEntity();
    propertyEntity.id = "1";
    propertyEntity.name = "Condo";
    propertyEntity.description = "Nice Condo in Downtown";
    propertyEntity.maxGuests = 0;
    propertyEntity.basePricePerNight = 200;
    expect(() => PropertyMapper.toDomain(propertyEntity)).toThrow(
      "O número máximo de hóspedes deve ser maior que zero"
    );
  });

  it("deve retornar erros quando a propriedade não tem nome", () => {
    const propertyEntity = new PropertyEntity();
    propertyEntity.id = "1";
    propertyEntity.description = "Nice Condo in Downtown";
    propertyEntity.maxGuests = 2;
    propertyEntity.basePricePerNight = 200;
    expect(() => PropertyMapper.toDomain(propertyEntity)).toThrow(
      "O nome é obrigatório"
    );
  });

  it("deve converter Property para PropertyEntity corretamente", () => {
    const propertyInstance = new Property(
      "1",
      "Condo 2",
      "Brand New Condo",
      3,
      200
    );
    const propertyEntity = PropertyMapper.toPersistence(propertyInstance);

    expect(propertyEntity.id).toBe("1");
    expect(propertyEntity.name).toBe(propertyInstance.getName());
    expect(propertyEntity.description).toBe(propertyInstance.getDescription());
    expect(propertyEntity.maxGuests).toBe(propertyInstance.getMaxGuests());
    expect(propertyEntity.basePricePerNight).toBe(
      propertyInstance.getBasePricePerNight()
    );
  });
});

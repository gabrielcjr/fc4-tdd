import express from "express";
import request from "supertest";
import { DataSource } from "typeorm";
import { PropertyController } from "./property_controller";
import { TypeORMPropertyRepository } from "../repositories/typeorm_property_repository";
import { PropertyService } from "../../application/services/property_service";
import { PropertyEntity } from "../persistence/entities/property_entity";
import { BookingEntity } from "../persistence/entities/booking_entity";
import { UserEntity } from "../persistence/entities/user_entity";
const app = express();
app.use(express.json());

let dataSource: DataSource;
let propertyRepository: TypeORMPropertyRepository;
let propertyService: PropertyService;
let propertyController: PropertyController;

beforeAll(async () => {
  dataSource = new DataSource({
    type: "sqlite",
    database: ":memory:",
    dropSchema: true,
    entities: [PropertyEntity, BookingEntity, UserEntity],
    synchronize: true,
    logging: false,
  });

  await dataSource.initialize();

  propertyRepository = new TypeORMPropertyRepository(
    dataSource.getRepository(PropertyEntity)
  );

  propertyService = new PropertyService(propertyRepository);
  propertyController = new PropertyController(propertyService);

  app.post("/property", (req, res, next) => {
    propertyController.createProperty(req, res).catch((err) => next(err));
  });

  if (dataSource.isInitialized) {
    await dataSource.getRepository(BookingEntity).clear();
    await dataSource.getRepository(PropertyEntity).clear();
    await dataSource.getRepository(UserEntity).clear();
  }
});

describe("PropertyController", () => {
  it("deve criar uma propriedade com sucesso", async () => {
    const response = await request(app).post("/property").send({
      id: "1",
      name: "Condo",
      description: "New Condo",
      maxGuests: 4,
      basePricePerNight: 199,
    });
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Property created successfully");
  });

  it("deve retornar erro com código 400 e mensagem 'O nome da propriedade é obrigatório.' ao enviar um nome vazio", async () => {
    const response = await request(app).post("/property").send({
      id: "1",
      name: null,
      description: "New Condo",
      maxGuests: 4,
      basePricePerNight: 199,
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("O nome é obrigatório");
});

it("deve retornar erro com código 400 e mensagem 'A capacidade máxima deve ser maior que zero.' ao enviar maxGuests igual a zero ou negativo", async () => {
    const response = await request(app).post("/property").send({
        id: "1",
        name: "Condo",
        description: "New Condo",
        maxGuests: 0,
        basePricePerNight: 199,
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("O número máximo de hóspedes deve ser maior que zero");
  });

  it("deve retornar erro com código 400 e mensagem 'O preço base por noite é obrigatório.' ao enviar basePricePerNight ausente", async () => {
    const response = await request(app).post("/property").send({
        id: "1",
        name: "Condo",
        description: "New Condo",
        maxGuests: 4,
        basePricePerNight: 0,
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("O preço base deve ser maior que zero");
  });
});

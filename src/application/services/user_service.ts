import { User } from "../../domain/entities/user";
import { UserRepository } from "../../domain/repositories/user_repository";
import { CreateUserDTO } from "../dtos/create_user_dto";

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async findUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }
  async createUser(dto: CreateUserDTO): Promise<void> {
    const user = new User(dto.id, dto.name);
    this.userRepository.save(user);
  }
}

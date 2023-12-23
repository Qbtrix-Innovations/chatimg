import type { User } from "../entities/User";
import type { UserRepository } from "../repositories/userRepository";

export class AddNewUser {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async execute(user:User): Promise<User> {
        return await this.userRepository.addNewUser(user);
    }
}

export class getUserFromId {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async execute(UserId:string): Promise<User> {
        return await this.userRepository.getUserById(UserId);
    }
}


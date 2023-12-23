import type { User } from "../entities/User";

export interface UserRepository {
    addNewUser(user:User): Promise<User>;
    getUserById(userId:string):Promise<User>;
}

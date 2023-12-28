import type { User } from "../entities/User";

export interface UserRepository {
    addNewUser(user:User): Promise<void>;
    getUserById(userId:string):Promise<User>;
    getUserByStripeId(stripeId:string):Promise<User>;
}

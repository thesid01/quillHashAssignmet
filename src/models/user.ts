import {Entity, PrimaryColumn, Column, Connection, Tree, getRepository} from "typeorm";
import bcrypt from 'bcryptjs'; 
import jwt from 'jsonwebtoken';

const SECRET_KEY  = "secretkey23456";
const PAGE_SIZE = 3
@Entity()
class User {
    @PrimaryColumn()
    email: string;

    @Column()
    password: string;

    @Column()
    profilePicture: string;
}

const createUser = async (
    connection: any, 
    data: User) =>{
    const user = new User();
    user.email = data.email;
    user.password = bcrypt.hashSync(data.password);
    user.profilePicture = "";
    await connection.manager.save(user);
    console.log("Saved a new user with email: " + user.email);
    const  expiresIn  =  24  *  60  *  60;
    const  accessToken  =  jwt.sign({ email:  user.email }, SECRET_KEY, {
        expiresIn:  expiresIn
    });

    console.log("Loading users from the database...");
    const users = await connection.manager.find(User);
    console.log("Loaded users: ", users);
    return { "user":  user, "access_token":  accessToken, "expires_in":  expiresIn};
}

const checkValidUser = async(
    connection: any, 
    data: User,
    oldUser:User) =>{
    if(bcrypt.compareSync(data.password, oldUser.password)){
        const  expiresIn  =  24  *  60  *  60;
        const  accessToken  =  jwt.sign({ email:  oldUser.email }, SECRET_KEY, {
            expiresIn:  expiresIn
        });
        return {"valid" : true, user :{ "user":  oldUser, "access_token":  accessToken, "expires_in":  expiresIn}};
    }else{
        return {"valid" : false, user :{}};
    }
}

const getUsers = async(connection:any, count:number) => {
    const users = await getRepository(User)
                        .createQueryBuilder("user")
                        .select(["user.email", "user.profilePicture"])
                        .skip((count-1)*PAGE_SIZE)
                        .take(PAGE_SIZE)
                        .getMany();
    console.log("Loaded users: ", users);
    return users;
}
export { User, createUser, checkValidUser, getUsers };
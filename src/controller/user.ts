import {createConnection, getRepository} from "typeorm";
import { User, createUser, checkValidUser, getUsers } from "../models/user";
import fs from 'fs'

export const createUserController = (req: any, res: any, next:any) => {
    createConnection().then(async connection => {
        let oldUser = await getRepository(User).findOne({ email: req.body.email });
        if(oldUser){
            console.log("User exixts.")
            res.status(409).send({"error" : "user already exists"});
        }else{
            console.log("Inserting a new user into the database...");
            const user = await createUser(connection, req.body);
            res.status(200).send(user);
        }
        await connection.close();

    }).catch((error) => {
        console.log(error)
        res.status(500).send({"error" : error});
    });

}

export const userLogin = (req: any, res: any, next: any) => {
    createConnection().then(async connection => {
        let oldUser = await getRepository(User).findOne({ email: req.body.email });
        if(oldUser){
            const {valid, user} = await checkValidUser(connection, req.body, oldUser);
            if(valid){
                res.status(200).send(user);
            }else{
                res.status(401).send({"error" : "password not valid"});
            }
        }else{
            res.status(404).send({"error": "user not found"});
        }
        await connection.close();
    }).catch((error) => {
        res.status(500).send({"error" : error});
    });
}

export const updateProfilePicture =async (req: any, res: any, next: any) => {
    console.log("updating database");
    createConnection().then(async connection => {
        const url = "public/images/"+req.file.filename;
        let oldUrl = (await getRepository(User).findOne({email: res.useremail})).profilePicture;
        await getRepository(User).update({email: res.useremail},{profilePicture: url});
        if(oldUrl){
            fs.unlinkSync(oldUrl);
        }
        res.status(200).send({"success" : "picture is updated"});
        await connection.close();
    }).catch((errror) => {
        res.status(500).send({"error" : errror});
    });
}

export const loadUsers = async(req: any, res: any, next: any) => {
    if(req.query.page && req.query.page >0){
        createConnection().then(async connection => {
            let users = await getUsers(connection, req.query.page);
            if(users.length==0){
                res.status(200).send({"value error": "you exceeded total pages"});
                await connection.close();
            }
            res.status(200).send(users);
            await connection.close();
        }).catch((error)=>{
            res.status(500).send({"error" : error});
        })  
    }else{
        res.status(500).send({"error" : "give Page number"});
    }
}
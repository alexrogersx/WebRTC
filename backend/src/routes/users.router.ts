import express, { Request, Response } from "express";
import ObjectID from 'bson-objectid';

import bcrypt from 'bcrypt';

import User from '../shared/classes/User.js';
import {UserModel} from "../database/models.js";
import {uploadMemory} from "../util/middleware/filesMiddleware.js";

const usersRouter = express.Router();


usersRouter.get("/", async (_req: Request, res: Response) => {
    try {
       const users = (await UserModel.find({}));
       /** Convert the documents to plain objects (and remove sensitive information) */
       users.map(user => user.toObject())
        res.status(200).send(users);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).send(error.message);
        } else {
            res.status(500).send('Unknown Error Occurred');
        }
    }
});

usersRouter.get("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;
    try {
        const query = { _id: new ObjectID(id) };
        const user = (await UserModel.findOne(query,{},{maxTime: 30_000})) as User;
        if (user) {
            res.status(200).send(user);
        }
    } catch (error) {
        res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
    }
});
/** Use uploadMemory middleware to retrieve icon image from "icon" formdata field */
usersRouter.post("/", uploadMemory.single('icon'), async (req: Request, res: Response) => {
    try {
        const {id, firstName, lastName, password, email} = req.body;
        const passwordHash = await bcrypt.hash(password, 10)
        const newUser = new UserModel ({
            _id: id,
            firstName,
            lastName,
            passwordHash,
            email,
            icon: {
                data: req?.file?.buffer,
                mimeType: req?.file?.mimetype
            },
        })
        const result = await newUser.save();
        result
            ? res.status(201).json(result.toObject())
            : res.status(500).send("Failed to create a new user.");
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(400).send(error.message);
        }
        else res.status(400).send()
    }
});

usersRouter.put("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const query = { _id: new ObjectID(id) };
        const {firstName, lastName, password, email} = req.body;
        const passwordHash = await bcrypt.hash(password, 10)
        const updatedUser = {
            firstName,
            lastName,
            passwordHash,
            email,
            ...query
        }
        const result = await UserModel.updateOne(query, { $set: updatedUser });
        result
            ? res.status(200).send(`Successfully updated user with id ${id}`)
            : res.status(304).send(`User with id: ${id} not updated`);
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            res.status(400).send(error.message);
        }
        console.error('Unknown Error at user PUT');
        res.status(400).send();
    }
});

usersRouter.delete("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;
    try {
        const query = { _id: new ObjectID(id) };
        const result = await UserModel.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Successfully removed user with id ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove user with id ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`User with id ${id} does not exist`);
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            res.status(400).send(error.message);
        }
        console.error('Unknown Error at user DELETE');
        res.status(400).send();
    }
});
export default usersRouter
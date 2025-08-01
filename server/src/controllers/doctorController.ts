import { Request, Response, NextFunction} from "express";
import ApiError from "../error/ApiError.js";
import models from "../models/models.js"; 

const {Doctor} = models;

class DoctorController {
    static async getAll(req: Request, res: Response) {
        const limit = parseInt(req.query.limit as string) || 10;
        const page = parseInt(req.query.page as string) || 1;
        const offset = (page - 1) * limit;

        const doctors = await Doctor.findAndCountAll({limit, offset});
        return res.status(200).json(doctors)
    }

    static async getDoctorByUser(req: Request, res: Response, next: NextFunction) {
        const {userId} = req.params;
        const doctor = await Doctor.findOne({where: {userId}})
        if(!doctor) {
            return next(ApiError.badRequest('Пользователь не является доктором'))
        }
        return res.status(200).json(doctor)
    }

    static async getOne(req: Request, res: Response, next: NextFunction) {
        const {id} = req.params;
        const doctor = await Doctor.findOne({where: {id}});
        if(!doctor) {
            return next(ApiError.badRequest('доктора не существует с таким id'))
        }
        return res.status(200).json(doctor)
    }

    static async create(req: Request, res: Response) {
        const {specialization, contacts, experience_years, userId} = req.body;
        const newDoctor = await Doctor.create({specialization, contacts, experience_years, userId})
        return res.json(newDoctor)
    }
}

export default DoctorController;
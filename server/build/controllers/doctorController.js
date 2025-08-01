import ApiError from "../error/ApiError.js";
import models from "../models/models.js";
const { Doctor } = models;
class DoctorController {
    static async getAll(req, res) {
        const doctors = await Doctor.findAll();
        return res.status(200).json(doctors);
    }
    static async getOne(req, res, next) {
        const { id } = req.params;
        const doctor = await Doctor.findOne({ where: { id } });
        if (!doctor) {
            return next(ApiError.badRequest('доктора не существует с таким id'));
        }
        return res.status(200).json(doctor);
    }
    static async create(req, res) {
        const { specialization, contacts, experience_years, userId } = req.body;
        const newDoctor = await Doctor.create({ specialization, contacts, experience_years, userId });
        return res.json(newDoctor);
    }
}
export default DoctorController;
//# sourceMappingURL=doctorController.js.map
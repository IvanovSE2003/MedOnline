import ApiError from "../error/ApiError.js";
import models from "../models/models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';
const { User } = models;
const generateJwt = (id, email, role) => {
    return jwt.sign({ id, email, role }, process.env.SECRET_KEY, { expiresIn: '24h' });
};
class UserController {
    static async registrations(req, res, next) {
        try {
            const { email, password, role, name, surname, patronymic, phone, pin_code, gender, date_birth, time_zone } = req.body;
            if (!req.files || !req.files.img) {
                return next(ApiError.badRequest('Файл изображения не загружен'));
            }
            const img = req.files.img;
            const fileName = v4() + '.jpg';
            const filePath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'static', fileName);
            await img.mv(filePath);
            if (!email || !password) {
                return next(ApiError.badRequest('Некорректный email или пароль'));
            }
            const candidate = await User.findOne({ where: { email } });
            if (candidate) {
                return next(ApiError.badRequest('Пользователь с таким email уже есть в системе'));
            }
            const hashPassoword = await bcrypt.hash(password, 5);
            const user = await User.create({
                email,
                role,
                password: hashPassoword,
                name,
                surname,
                patronymic,
                phone,
                pin_code,
                gender,
                date_birth,
                time_zone,
                img: fileName
            });
            const token = generateJwt(user.id, user.email, user.role);
            return res.json({ token });
        }
        catch (e) {
            if (e instanceof Error) {
                next(ApiError.badRequest(e.message));
            }
            else {
                next(ApiError.badRequest('Неизвестная ошибка'));
            }
        }
    }
    static async login(req, res, next) {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return next(ApiError.internal('Пользователь с таким именем не найден'));
        }
        let comparePassword = bcrypt.compareSync(password, user.password);
        if (!comparePassword) {
            return next(ApiError.internal('Не верный пароль пользователя'));
        }
        const token = generateJwt(user.id, user.email, user.role);
        return res.json({ token });
    }
    static async check(req, res, next) {
        if (!req.user) {
            return next(ApiError.internal('Пользователь не авторизован'));
        }
        const token = generateJwt(req.user.id, req.user.email, req.user.role);
        return res.json({ token });
    }
}
export default UserController;
//# sourceMappingURL=userController.js.map
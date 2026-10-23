import {Router} from "express";
import { login, register } from "../controllers/auth.controller.js";
import { validateLoginUser, validateRegisterUser } from "../validator/auth.validator.js";

const router=Router()

//POST/api/auth/register
router.post('/register',validateRegisterUser,register)


//POST/api/auth/login

router.post('login',validateLoginUser,login)


export default router

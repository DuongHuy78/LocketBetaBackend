import express from "express";
import { register } from "../controller/auth/register_controller.js";
import { login } from "../controller/auth/login_controller.js";
import { refresh } from "../controller/auth/refresh_controller.js";
import { forgotPassword, resetPassword } from "../controller/auth/forgot_password_controller.js";
import { logout } from "../controller/auth/logout_controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/logout", logout);

export default router;

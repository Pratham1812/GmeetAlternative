"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.signUp = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = __importDefault(require("../models/user.model"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, username, password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
            return res.status(400).json({
                error: "Passwords do not match"
            });
        }
        const user = yield user_model_1.default.findOne({ username }); //this will check if user with username exists in db or not
        if (user) {
            return res.status(400).json({
                error: "User already exists"
            });
        }
        //Hash the password here 
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        //https://avatar-placeholder.iran.liara.run/ => for avatars
        const newUser = new user_model_1.default({
            fullName,
            username,
            password: hashedPassword,
        });
        if (newUser) {
            //Generate JWT Token here 
            (0, generateToken_1.default)(newUser._id, res);
            yield newUser.save();
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
            });
        }
        else {
            res.status(500).json({ error: "Invalid user data" });
        }
    }
    catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.signUp = signUp;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const user = yield user_model_1.default.findOne({ username });
        const isPasswordCorrect = yield bcryptjs_1.default.compare(password, (user === null || user === void 0 ? void 0 : user.password) || "");
        if (!user || !isPasswordCorrect) {
            return res.status(400).json({
                error: "Invalid username or password "
            });
        }
        (0, generateToken_1.default)(user._id, res);
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
        });
    }
    catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.login = login;
const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({
            message: "Logged out successfully"
        });
    }
    catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.logout = logout;

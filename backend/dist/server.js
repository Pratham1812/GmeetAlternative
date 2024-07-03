"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const connectToDB_1 = __importDefault(require("./db/connectToDB"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
    // Some legacy browsers choke on 204
}));
app.get('/', (req, res) => {
    res.send("Hello World!!");
});
// Middlewares
app.use(express_1.default.json()); // to extract the fields from req.body
app.use((0, cookie_parser_1.default)()); // to extract the cookie from req.cookies
app.use("/api/auth", auth_routes_1.default);
app.listen(PORT, () => {
    (0, connectToDB_1.default)();
    console.log(`server is running on port ${PORT}`);
});

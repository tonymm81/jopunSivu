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
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const fetch = require("node-fetch");
const dotenv_1 = __importDefault(require("dotenv"));
const app = (0, express_1.default)();
dotenv_1.default.config();
const portti = Number(process.env.SitePort);
let isEnglish = false;
let sitekey = process.env.googleCaptchaSiteKey;
app.set("view engine", "ejs");
app.use(express_1.default.static(path_1.default.resolve(__dirname, "public")));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/contact", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //let sitekey = "vitun paskaläjä"//process.env.googleCaptchaSiteKey
    //console.log("tullaanko ohjaukseen", sitekey)
    res.render("sendmail", { isEnglish, sitekey });
}));
app.get("/", (req, res) => {
    res.render("index", { isEnglish, sitekey });
});
app.get("/set-language/:lang", (req, res) => {
    const lang = req.params.lang;
    isEnglish = lang === "en";
    res.redirect("/");
});
app.post("/send-email", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, message, "g-recaptcha-response": recaptchaResponse } = req.body;
    const secretKey = process.env.googleCaptchaServerkey;
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaResponse}`;
    try {
        const response = yield fetch(verificationUrl, { method: "POST" });
        const data = yield response.json();
        console.log("vastaus", data);
        if (data.success === false) {
            return res.render("vahvistus", { viesti: "reCAPTCHA vahvistus epäonnistui. Yritä uudelleen. Please do the i am not robot again " });
        }
        console.log(process.env.Google_email, process.env.Google_Password);
        const transporter = nodemailer_1.default.createTransport({ host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: { user: process.env.Google_email, pass: process.env.Google_Password } });
        const mailOptions = { from: email, to: process.env.hotmailAccount,
            subject: `Yhteydenotto: ${name}`, text: ` viesti ${message} henkilöltä osoitteesta ${email}` };
        yield transporter.sendMail(mailOptions);
        res.render("vahvistus", { viesti: "Sähköposti lähetetty onnistuneesti! The mail is sended!" });
    }
    catch (error) {
        console.error("Virhe sähköpostin lähetyksessä:", error);
        res.render("vahvistus", { viesti: "Virhe sähköpostin lähetyksessä. There happend an error in sending a message" });
    }
}));
app.listen(portti, () => {
    console.log(`Palvelin käynnistyi osoitteeseen http://localhost:${portti}`);
});

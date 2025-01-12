import express from 'express';
import path from 'path';
import nodemailer from "nodemailer"; 
const fetch = require("node-fetch");
import dotenv from "dotenv";


const app : express.Application = express();

dotenv.config();

const portti : number =  Number(process.env.SitePort) ;

let isEnglish = false;
let sitekey = process.env.googleCaptchaSiteKey

app.set("view engine", "ejs");
app.use(express.static(path.resolve(__dirname, "public")));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.get("/contact", async (req : express.Request, res : express.Response) => {

   
  
   res.render("sendmail", { isEnglish, sitekey });

});

app.get("/", (req: express.Request, res: express.Response) => { 
    
    res.render("index", { isEnglish, sitekey }); 

});

app.get("/set-language/:lang", (req: express.Request, res: express.Response) => { 
    const lang = req.params.lang; 
    isEnglish = lang === "en";
    res.redirect("/"); 
});

app.post("/send-email", async (req: express.Request, res: express.Response) => { 
    const { name, email, message, "g-recaptcha-response": recaptchaResponse } = req.body; 
    const secretKey = process.env.googleCaptchaServerkey; 
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaResponse}`; 
    try { 
        const response = await fetch(verificationUrl, { method: "POST" }); 
        const data = await response.json(); 
        console.log("vastaus", data)
        if (data.success === false) {
            return res.render("vahvistus", { isEnglish : isEnglish, viesti: "reCAPTCHA vahvistus epäonnistui. Yritä uudelleen. Please do the i am not robot again "}); 
        } 
        console.log(process.env.Google_email, process.env.Google_Password)

        const transporter = nodemailer.createTransport({  host: "smtp.gmail.com",
            port: 465,
            secure: true, 
            auth: { user: process.env.Google_email, pass: process.env.Google_Password} }); 

        const mailOptions = { from: email, to: process.env.hotmailAccount, 
            subject: `Yhteydenotto: ${name}`, text: ` viesti ${message} henkilöltä osoitteesta ${email}` }; 

        await transporter.sendMail(mailOptions); 
        res.render("vahvistus", { isEnglish : isEnglish, viesti: "Sähköposti lähetetty onnistuneesti! The mail is sended!"}); 
    } catch (error) { 
        console.error("Virhe sähköpostin lähetyksessä:", error); 
        res.render("vahvistus", {isEnglish : isEnglish, viesti: "Virhe sähköpostin lähetyksessä. There happend an error in sending a message"}); } 
    
    });


app.listen(portti, () => {

    console.log(`Palvelin käynnistyi osoitteeseen http://localhost:${portti}`);    

});
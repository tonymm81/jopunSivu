import express from 'express';
import path from 'path';
import nodemailer from "nodemailer"; 
const fetch = require("node-fetch");

const app : express.Application = express();



const portti : number =  3002;

app.set("view engine", "ejs");

app.use(express.static(path.resolve(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.post("/poista", async (req : express.Request, res : express.Response) => {

   

    res.redirect("/");

});


app.post("/", async (req : express.Request, res : express.Response) => {



    res.render("index", { ostokset : "" });

});

app.get("/contact", async (req : express.Request, res : express.Response) => {

   console.log("tullaanko ohjaukseen")
   res.render("sendmail");

});


app.get("/", async (req : express.Request, res : express.Response) => {

    

    res.render("index", { ostokset : "" });

});

app.post("/send-email", async (req: express.Request, res: express.Response) => { 
    const { name, email, message, "g-recaptcha-response": recaptchaResponse } = req.body; 
    const secretKey = "YOUR_SECRET_KEY"; 
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaResponse}`; 
    try { 
        const response = await fetch(verificationUrl, { method: "POST" }); 
        const data = await response.json(); 
        if (!data) {
            return res.send("reCAPTCHA vahvistus epäonnistui. Yritä uudelleen."); 
        } 
        const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: 'your-email@gmail.com', pass: 'your-email-password'} }); 
        const mailOptions = { from: email, to: 'your-email@gmail.com', subject: `Yhteydenotto: ${name}`, text: message }; 
        await transporter.sendMail(mailOptions); res.send("Sähköposti lähetetty onnistuneesti!"); 
    } catch (error) { 
        console.error("Virhe sähköpostin lähetyksessä:", error); 
        res.send("Virhe sähköpostin lähetyksessä."); } 
    
    });


app.listen(portti, () => {

    console.log(`Palvelin käynnistyi osoitteeseen http://localhost:${portti}`);    

});
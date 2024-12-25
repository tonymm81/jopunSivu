import express from 'express';
import path from 'path';


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

app.listen(portti, () => {

    console.log(`Palvelin käynnistyi osoitteeseen http://localhost:${portti}`);    

});
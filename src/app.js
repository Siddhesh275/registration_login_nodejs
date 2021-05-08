const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
require("./db/conn");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const Register = require("./models/registers");
const auth = require("./middleware/auth");

const port = process.env.PORT || 3000; 
const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

// console.log(static_path);
// app.use(express.static(static_path));

app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(cookieParser());

app.set("view engine","hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

 app.get("/", (req,res) => {
    res.render("index");
}); 

app.get("/secret", auth , (req,res) => {
    res.render("secret");
});

app.get("/login", (req,res) => {
    res.render("login");
});

app.post("/login", async (req,res) => {
    try
    {
        const email = req.body.email;
        const password = req.body.password;

        const userEmail = await Register.findOne({email: email});
        const matchPassword = await bcrypt.compare(password, userEmail.password);

        console.log(matchPassword);
        if(matchPassword)
        {
            res.status(201).render("index");
        }
        else{
            res.send("<h1>Invalid Login details</h1>");
        }
    }
    catch(e)
    {
        res.status(400).send("<h1>Invalid Login details</h1>");
    }
});

app.get("/register", (req,res) => {
    res.render("register");
});

app.post("/register", async (req,res) => {
    try{
        const password = req.body.password;
        const confirm_pass = req.body.confirm_password;

       // console.log(password);
       // console.log(confirm_pass);
         
        const hashedPass = await bcrypt.hash(password , 10);
      //  console.log(hashedPass);

        if(password === confirm_pass)
        {
            const registerEmployee = new Register({
                firstName : req.body.first_name,
                lastName : req.body.last_name,
                email : req.body.email,
                password : hashedPass,
                confirmPassword : confirm_pass
            });

          //  const token = await registerEmployee.generateAuthToken();
          //  console.log(`the token is ${token}`);

            const result = await registerEmployee.save();
            console.log(result);
            const generated_token = jwt.sign({_id: result._id}, "mynameissiddheshkulkarniwebdeveloper");

            res.cookie("jwt", generated_token);

            console.log(generated_token);
            res.status(201).render("index");
        }
        else{
            res.send("<h1> Password does not match </h1>");
        }
    }
    catch(error) 
    {
        res.status(400).send(error);
    }
});

app.listen(port , () => {
    console.log(`Server is running at ${port} !!!`);
});
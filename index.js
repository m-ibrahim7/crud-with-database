const express = require("express");
const bodyParser = require("body-parser");
const path = require("path")
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "/public")))
app.use(bodyParser.urlencoded({
    extended: true
}));

const userSchema = new mongoose.Schema({
    name: String,
    email: String
});

const User = mongoose.model('User', userSchema);

mongoose.connect('mongodb://localhost:27017/Database', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to Database"))
    .catch(err => console.error("Error in Connecting to Database:", err));

app.post("/sign_up", async (req, res) => {
    try {
        const name = req.body.name;
        const email = req.body.email;

        const newUser = new User({
            name: name,
            email: email
        });

        await newUser.save()
            .then(() => {
                console.log("Record Inserted Successfully");
                res.json("Record Added")
            })
            .catch(err => {
                console.error("Error saving user:", err);
                res.json("Error")
            });
    } catch (err) {
        console.error("Error:", err);
    }
});


app.get("/", (req, res) => {
    console.log("asdlk;");
    res.set({
        "Access-Control-Allow-Origin": '*'
    });
    res.redirect('index.html');
});

app.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        console.error("Error:", err);
    }
});

app.delete("/deleteUser/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        await User.findByIdAndDelete(userId);
    } catch (err) {
        console.error("Error deleting user:", err);
    }
});

app.put("/updateUser", async (req, res) => {
    try {
        const userId = req.body;
        await User.findByIdAndUpdate({_id:userId.id},{name : userId.name,email : userId.email});
    } catch (err) {
        console.error("Error deleting user:", err);
    }
});


const port = 3000;
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});


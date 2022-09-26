import express, { urlencoded } from "express";
import flash from 'express-flash';
import session from 'express-session';
import { authController } from "./controllers/auth.controller.js";
import { tasksController } from "./controllers/tasks.controller.js";
import { authMiddleware } from "./middlewares/auth.middleware.js";

// inisiasi aplikasi express
const app = express();

// digunakan untuk set view engine menggunakan ejs
app.set("view engine", "ejs");

// digunakan untuk menyiapkan session storage
app.use(session({
	secret: 'f*&23b87&^S%sdfs',
	saveUninitialized: false,
	resave: false,
}))

// digunakan untuk menyiapkan flash message
app.use(flash())

// digunakan untuk menangkap form request yang diinput oleh user
app.use(urlencoded({ extended: true }));

// registrasi route-route yang digunakan pada aplikasi
app.get("/", authMiddleware, tasksController.index);

app.get('/register', authController.register);
app.post('/register', authController.handleRegister);

app.get('/login', authController.login);
app.post('/login', authController.handleLogin);

app.post('/logout', authController.handleLogout);

app.post("/tasks", tasksController.store);
app.post("/tasks/:taskId", tasksController.updateTask);

// memulai aplikasi pada port 3000
app.listen(3000, () => console.log("app running on http://localhost:3000"));

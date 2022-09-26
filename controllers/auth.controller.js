import bcrypt from "bcrypt";
import { execQuery } from "../databases/connection.js";

const SALT_ROUNDS = 8;

export const authController = {
	register: (req, res) => {
		return res.render("register", { info: req.flash("info") });
	},

	handleRegister: async (req, res) => {
		try {
			const user = {
				username: req.body.username,
				password: req.body.password,
			};

			if (!user.username || !user.password) {
				req.flash("info", "Username & Password is required!");
				res.redirect("/register");
			}

			user.password = bcrypt.hashSync(user.password, SALT_ROUNDS);

			await execQuery("insert into users (username, password) values (?, ?)", [user.username, user.password]);

			req.flash("info", "Registration success! You may login with your account.");
			return res.redirect("/login");
		} catch (error) {
			req.flash("info", error.message || "Internal server error!");
			return res.redirect("/register");
		}
	},

	login: (req, res) => {
		return res.render("login", { info: req.flash("info") });
	},

	handleLogin: async (req, res) => {
		const user = {
			username: req.body.username,
			password: req.body.password,
		}

		if (!user.username || !user.password) {
			req.flash("info", "Username & Password is required!");
			return res.redirect("/register");
		}

		const findUsers = await execQuery('select * from users where username = ?', [user.username]);
		if (!findUsers[0]) {
			req.flash('info', 'User not found!');
			return res.redirect('/login');
		}

		const passwordValid = bcrypt.compareSync(user.password, findUsers[0].password);
		if (!passwordValid) {
			req.flash('info', 'Password incorrect!');
			return res.redirect('/login');
		}

		req.session.user = {id: findUsers[0].id, username: user.username};
		return res.redirect('/');
	},

	handleLogout: async (req, res) => {
		req.session.user = undefined;
		return res.redirect('/login');
	}
};

import dayjs from "dayjs";
import { db, execQuery } from "../databases/connection.js";

export const tasksController = {
	index: async (req, res) => {
		const user = req.session.user;

		const tasks = await execQuery("select * from tasks where user_id = ? order by date desc", [user.id]);

		return res.render("index", { tasks, user });
	},

	store: async (req, res) => {
		const user = req.session.user;
		const data = req.body;

		const now = dayjs().format("YYYY-MM-DD HH:mm:ss");
		await execQuery(`insert into tasks (user_id, title, is_done, date) values (?, ?, false, "${now}");`, [user.id, data.task]);

		return res.redirect("/");
	},

	updateTask: async (req, res) => {
		const user = req.session.user;
		const action = req.body.action;

		switch (action) {
			case "done":
				await execQuery(`update tasks set is_done = true where id = ? and user = ?`, [req.params.taskId, user.id]);
				break;
			case "undone":
				await execQuery(`update tasks set is_done = false where id = ? and user = ?`, [req.params.taskId, user.id]);
				break;
			case "delete":
				await execQuery("delete from tasks where id = ? and user = ?", [req.params.taskId, user.id]);
				break;
			default:
		}

		return res.redirect("/");
	},
};

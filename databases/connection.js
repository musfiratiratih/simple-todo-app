import { createConnection } from "mysql2";

export const db = createConnection({
	host: "127.0.0.1",
	port: "3306",
	user: "halimtuhu",
	password: "halimtuhu",
	database: "belajar_express_mysql",
});

export const execQuery = async (sql, values = []) => {
	return new Promise((resolve, reject) => {
		db.query(sql, values, (err, result) => {
			if (err) reject(err);
			else resolve(result);
		});
	});
};

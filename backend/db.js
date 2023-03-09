import mysql from "mysql2";
// import mysql from "mysql";

export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "secret123",
  database: "mernblog",
});

db.connect(function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Database connected");
  }
});

// export const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "secret123",
//   database: "mernblog",
//   authPlugins: {
//     mysql_native_password: () =>
//       require("mysql2").auth.authentication.mysqlNativePasswordAuth,
//   },
//Error Code: 1238. Variable 'default_authentication_plugin' is a read only variable

// });

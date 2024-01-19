const dotenv = require("dotenv");
dotenv.config();
// dotenv.config({ path: `.env.local`, override: true });
module.exports = process.env;

/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const ThreadTableTestHelper = {
  async addThread({
    id = "thread-123",
    title = "abc",
    body = "description",
    owner = "user-123",
  }) {
    const query = {
      text: "INSERT INTO thread VALUES($1, $2, $3, $4)",
      values: [id, title, body, owner],
    };
    await pool.query(query);
  },

  async cleanTable() {
    await pool.query("DELETE FROM thread WHERE 1=1");
  },
};

module.exports = ThreadTableTestHelper;

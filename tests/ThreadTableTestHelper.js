/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const ThreadTableTestHelper = {
  async addThread({
    id = "thread-123",
    title = "abc",
    body = "description",
    owner = "user-123",
    date = Date.now() / 1000,
  }) {
    const query = {
      text: "INSERT INTO thread VALUES($1, $2, $3, $4, TO_TIMESTAMP($5))",
      values: [id, title, body, owner, date],
    };
    await pool.query(query);
  },

  async findThreadById(id) {
    const query = {
      text: "SELECT * FROM thread WHERE id = $1",
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query("DELETE FROM thread WHERE 1=1");
  },
};

module.exports = ThreadTableTestHelper;

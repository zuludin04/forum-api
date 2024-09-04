/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const CommentsTableTestHelper = {
  async addComment({
    id = "comment-123",
    content = "comment",
    owner = "user-123",
    thread = "thread-123",
    date = Date.now() / 1000,
  }) {
    const query = {
      text: "INSERT INTO commentthread VALUES($1, $2, $3, $4, $5, TO_TIMESTAMP($6))",
      values: [id, content, owner, thread, 0, date],
    };
    await pool.query(query);
  },

  async findCommentById(id) {
    const query = {
      text: "SELECT * FROM commentthread WHERE id = $1",
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query("DELETE FROM commentthread WHERE 1=1");
  },
};

module.exports = CommentsTableTestHelper;

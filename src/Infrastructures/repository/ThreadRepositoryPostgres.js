const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const Thread = require("../../Domains/threads/entities/Thread");
const ThreadRepository = require("../../Domains/threads/ThreadRepository");

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(newThread) {
    const { title, body, owner } = newThread;
    const id = `thread-${this._idGenerator()}`;
    const currentDate = Date.now() / 1000;

    const query = {
      text: "INSERT INTO thread VALUES($1, $2, $3, $4, TO_TIMESTAMP($5)) RETURNING id, title, owner",
      values: [id, title, body, owner, currentDate],
    };

    const result = await this._pool.query(query);

    return new Thread({ ...result.rows[0] });
  }

  async verifyThreadExistence(thread) {
    const query = {
      text: "SELECT * FROM thread WHERE id = $1",
      values: [thread],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("thread tidak ditemukan");
    }
  }

  async detailThread(thread) {
    const query = {
      text: `
      SELECT 
        thread.id, 
        thread.title, 
        thread.body, 
        thread.date, 
        users.username 
      FROM thread 
      INNER JOIN users ON thread.owner = users.id 
      WHERE thread.id = $1`,
      values: [thread],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("thread tidak ditemukan");
    }

    return result.rows[0];
  }
}

module.exports = ThreadRepositoryPostgres;

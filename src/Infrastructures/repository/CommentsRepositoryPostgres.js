const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const CommentsRepository = require("../../Domains/comments/CommentsRepository");
const Comments = require("../../Domains/comments/entities/Comments");

class CommentsRepositoryPostgres extends CommentsRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(comment) {
    const { content, owner, thread } = comment;
    const id = `comment-${this._idGenerator()}`;
    const currentDate = Date.now() / 1000;

    const query = {
      text: "INSERT INTO commentthread VALUES($1, $2, $3, $4, $5, TO_TIMESTAMP($6)) RETURNING id, content, owner",
      values: [id, content, owner, thread, 0, currentDate],
    };

    const result = await this._pool.query(query);

    return new Comments({ ...result.rows[0] });
  }

  async softDeleteComment(comment) {
    const { id, owner } = comment;
    const query = {
      text: `UPDATE commentthread SET is_delete = 1 WHERE id = $1 RETURNING id, owner, is_delete`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("tidak ada komentar untuk dihapus");
    }

    if (result.rows[0].owner !== owner) {
      throw new AuthorizationError(
        "anda tidak memiliki akses untuk menghapus komentar ini"
      );
    }

    return result.rows[0];
  }

  async commentsByThread(thread) {
    const query = {
      text: `
      SELECT 
        commentthread.id, 
        users.username, 
        (CASE WHEN commentthread.is_delete = 1 THEN '**komentar telah dihapus**' ELSE commentthread.content END) AS content, 
        TO_CHAR(commentthread.date, 'Dy Mon DD YYYY') AS date
      FROM commentthread 
      INNER JOIN users ON commentthread.owner = users.id 
      WHERE commentthread.thread = $1
      ORDER BY commentthread.date ASC`,
      values: [thread],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = CommentsRepositoryPostgres;

const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const CommentsRepository = require("../../Domains/comments/CommentsRepository");
const Comments = require("../../Domains/comments/entities/Comments");
const DetailComment = require("../../Domains/comments/entities/DetailComment");

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

  async softDeleteComment(id) {
    const query = {
      text: `UPDATE commentthread SET is_delete = 1 WHERE id = $1 RETURNING id, owner, is_delete`,
      values: [id],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async commentsByThread(thread) {
    const query = {
      text: `
      SELECT 
        commentthread.id, 
        users.username, 
        commentthread.content,
        TO_CHAR(commentthread.date, 'Dy Mon DD YYYY') AS date,
        commentthread.is_delete
      FROM commentthread 
      INNER JOIN users ON commentthread.owner = users.id 
      WHERE commentthread.thread = $1
      ORDER BY commentthread.date ASC`,
      values: [thread],
    };

    const result = await this._pool.query(query);

    const comments = result.rows.map(
      (value) =>
        new DetailComment({
          id: value.id,
          username: value.username,
          content: value.content,
          date: new Date(Date(value.date)).toDateString(),
          isDeleted: value.is_delete,
        })
    );

    return comments;
  }

  async verifyCommentExistence(comment) {
    const query = {
      text: `SELECT * FROM commentthread WHERE id = $1`,
      values: [comment],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("comment tidak ditemukan");
    }
  }

  async verifyCommentOwner(id, owner) {
    const query = {
      text: `SELECT * FROM commentthread WHERE id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    const comment = result.rows[0];
    if (comment.owner !== owner) {
      throw new AuthorizationError(
        "anda tidak memiliki akses untuk menghapus komentar ini"
      );
    }
  }
}

module.exports = CommentsRepositoryPostgres;

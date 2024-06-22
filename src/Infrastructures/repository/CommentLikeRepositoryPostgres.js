const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const CommentLikeRepository = require("../../Domains/comment_likes/CommentLikeRepository");

class CommentLikeRepositoryPostgres extends CommentLikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addCommentLike(threadId, commentId, userId) {
    const id = `like-${this._idGenerator()}`;
    const created_at = new Date();

    const query = {
      text: "INSERT INTO comment_likes VALUES($1, $2, $3, $4, $5) RETURNING id, thread_id, comment_id, user_id, created_at",
      values: [id, threadId, commentId, userId, created_at],
    };

    const { rowCount } = await this._pool.query(query);

    return rowCount;
  }

  async deleteCommentLike(threadId, commentId, userId) {
    const query = {
      text: "DELETE FROM comment_likes WHERE thread_id = $1 AND comment_id = $2 AND user_id = $3 RETURNING id",
      values: [threadId, commentId, userId],
    };

    const { rowCount } = await this._pool.query(query);

    return rowCount;
  }

  async verifyCommentLike(commentId, userId) {
    const query = {
      text: "SELECT 1 FROM comment_likes WHERE comment_id = $1 AND user_id = $2",
      values: [commentId, userId],
    };

    const { rowCount } = await this._pool.query(query);

    return rowCount;
  }

  async getCommentLikeCount(threadId) {
    const query = {
      text: "SELECT comment_id FROM comment_likes WHERE comment_id IN (SELECT id FROM comments WHERE thread_id = $1)",
      values: [threadId],
    };

    const { rows } = await this._pool.query(query);

    return rows;
  }
}

module.exports = CommentLikeRepositoryPostgres;

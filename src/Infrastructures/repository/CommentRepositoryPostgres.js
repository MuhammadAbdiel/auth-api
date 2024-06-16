const InvariantError = require("../../Commons/exceptions/InvariantError");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");
const CommentRepository = require("../../Domains/comments/CommentRepository");
const AddedComment = require("../../Domains/comments/entities/AddedComment");

class CommentRepositoryPostgress extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(commentContent, threadId, ownerId) {
    const id = `comment-${this._idGenerator()}`;
    const created_at = new Date();
    const is_delete = false;

    const query = {
      text: "INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) Returning id, content, user_id",
      values: [id, commentContent, created_at, ownerId, threadId, is_delete],
    };

    const result = await this._pool.query(query);

    return new AddedComment({
      id: result.rows[0].id,
      content: result.rows[0].content,
      owner: result.rows[0].user_id,
    });
  }

  async getCommentById(commentId) {
    const query = {
      text: "SELECT * FROM comments WHERE id = $1",
      values: [commentId],
    };

    const result = await this._pool.query(query);
    const comment = result.rows[0];

    return comment;
  }

  async getCommentByUserId(userId) {
    const query = {
      text: "SELECT * FROM comments WHERE user_id = $1",
      values: [userId],
    };

    const result = await this._pool.query(query);
    const comment = result.rows[0];

    return comment;
  }

  async verifyCommentInThreadAvailability(commentId, threadId) {
    const query = {
      text: "SELECT 1 FROM comments WHERE id = $1 AND thread_id = $2",
      values: [commentId, threadId],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError("comment not found");
    }

    return rowCount;
  }

  async verifyCommentOwner(commentId, ownerId) {
    const query = {
      text: "SELECT 1 FROM comments WHERE id = $1 AND user_id = $2",
      values: [commentId, ownerId],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new AuthorizationError("You are not the owner of this comment");
    }

    return rowCount;
  }

  async getCommentByThreadId(threadId) {
    const query = {
      text: "SELECT * FROM comments WHERE thread_id = $1 AND is_delete = false ORDER BY created_at ASC",
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async deleteComment(commentId, threadId, ownerId) {
    const query = {
      text: "UPDATE comments SET is_delete = true WHERE id = $1 AND thread_id = $2 AND user_id = $3 RETURNING id",
      values: [commentId, threadId, ownerId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError("failed to delete comment");
    }
  }
}

module.exports = CommentRepositoryPostgress;

/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const CommentLikesTableTestHelper = {
  async addCommentLike({
    id = "like-123",
    thread_id = "thread-123",
    comment_id = "comment-123",
    user_id = "user-123",
    created_at = new Date("2024-06-22T00:00:00.000Z"),
  }) {
    const query = {
      text: "INSERT INTO comment_likes VALUES($1, $2, $3, $4, $5) RETURNING id, thread_id, comment_id, user_id",
      values: [id, thread_id, comment_id, user_id, created_at],
    };

    await pool.query(query);
  },

  async findCommentLikeById(id) {
    const query = {
      text: "SELECT * FROM comment_likes WHERE id = $1",
      values: [id],
    };

    const result = await pool.query(query);

    return result.rows;
  },

  async cleanTable() {
    await pool.query("DELETE FROM comment_likes WHERE 1=1");
  },
};

module.exports = CommentLikesTableTestHelper;

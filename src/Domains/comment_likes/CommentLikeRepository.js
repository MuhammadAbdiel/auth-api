class CommentLikeRepository {
  async addCommentLike(threadId, commentId, userId) {
    throw new Error("COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async verifyCommentLike(commentId, userId) {
    throw new Error("COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async verifyCommentLikeOwner(commentLikeId, userId) {
    throw new Error("COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async getCommentLikeCount(threadId) {
    throw new Error("COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async deleteCommentLike(threadId, commentId, userId) {
    throw new Error("COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
}

module.exports = CommentLikeRepository;

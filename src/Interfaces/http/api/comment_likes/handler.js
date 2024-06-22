const CommentLikeUseCase = require("../../../../Applications/use_case/comment_likes/CommentLikeUseCase");

class CommentLikeHandler {
  constructor(container) {
    this._container = container;

    this.putLikeUnlikeHandler = this.putLikeUnlikeHandler.bind(this);
  }

  async putLikeUnlikeHandler(request, h) {
    const { threadId, commentId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const commentLikeUseCase = this._container.getInstance(
      CommentLikeUseCase.name
    );

    await commentLikeUseCase.execute(threadId, commentId, credentialId);

    return {
      status: "success",
    };
  }
}

module.exports = CommentLikeHandler;

const AddCommentUseCase = require("../../../../Applications/use_case/comments/AddCommentUseCase");
const DeleteCommentUseCase = require("../../../../Applications/use_case/comments/DeleteCommentUseCase");
const GetDetailsCommentUseCase = require("../../../../Applications/use_case/comments/GetDetailsCommentUseCase");

class CommentHandler {
  constructor(container) {
    this._container = container;
    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    this.getCommentDetailsHandler = this.getCommentDetailsHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const addCommentUseCase = this._container.getInstance(
      AddCommentUseCase.name
    );
    const { id: ownerId } = request.auth.credentials;
    const { threadId } = request.params;
    const addedComment = await addCommentUseCase.execute(
      request.payload,
      threadId,
      ownerId
    );

    const response = h.response({
      status: "success",
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request) {
    const deleteCommentUseCase = this._container.getInstance(
      DeleteCommentUseCase.name
    );
    const { id: creadentialId } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    await deleteCommentUseCase.execute(commentId, threadId, creadentialId);

    return {
      status: "success",
    };
  }

  async getCommentDetailsHandler(request, h) {
    const getDetailsCommentUseCase = this._container.getInstance(
      GetDetailsCommentUseCase.name
    );
    const { commentId } = request.params;
    const comment = await getDetailsCommentUseCase.execute(commentId);
    const response = h.response({
      status: "success",
      data: { comment },
    });

    return response;
  }
}

module.exports = CommentHandler;

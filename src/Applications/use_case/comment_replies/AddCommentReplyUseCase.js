const { use } = require("bcrypt/promises");
const InvariantError = require("../../../Commons/exceptions/InvariantError");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const NewCommentReply = require("../../../Domains/comment_replies/entities/NewCommentReply");

class AddCommentReplyUseCase {
  constructor({
    commentReplyRepository,
    commentRepository,
    threadRepository,
    userRepository,
  }) {
    this._commentReplyRepository = commentReplyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
  }

  async execute(
    useCasePayload,
    useCaseThreadId,
    useCaseCommentId,
    useCaseCredential
  ) {
    const { content } = new NewCommentReply(useCasePayload);

    // get comment and also to verify it
    await this._commentRepository.verifyCommentInThreadAvailability(
      useCaseCommentId,
      useCaseThreadId
    );

    // verify thread availability
    await this._threadRepository.verifyThreadAvailability(useCaseThreadId);

    // get user and also to verify it
    await this._userRepository.verifyUserAvailability(useCaseCredential);

    return await this._commentReplyRepository.addCommentReply(
      content,
      useCaseThreadId,
      useCaseCommentId,
      useCaseCredential
    );
  }
}

module.exports = AddCommentReplyUseCase;

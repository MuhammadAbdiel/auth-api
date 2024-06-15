const NewComment = require("../../../Domains/comments/entities/NewComment");

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository, userRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
  }

  async execute(useCasePayload, useCaseThreadId, useCaseCredential) {
    const { content } = new NewComment(useCasePayload);
    // verify thread availability
    await this._threadRepository.verifyThreadAvailability(useCaseThreadId);
    // verify user availability
    await this._userRepository.verifyUserAvailability(useCaseCredential);

    return await this._commentRepository.addComment(
      content,
      useCaseThreadId,
      useCaseCredential
    );
  }
}

module.exports = AddCommentUseCase;

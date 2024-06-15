const CommentReplyDetails = require("../../../Domains/comment_replies/entities/CommentReplyDetails");
const CommentDetails = require("../../../Domains/comments/entities/CommentDetails");

class GetDetailsCommentUseCase {
  constructor({ userRepository, commentRepository, commentReplyRepository }) {
    this._userRepository = userRepository;
    this._commentRepository = commentRepository;
    this._commentReplyRepository = commentReplyRepository;
  }

  async execute(useCaseCommentId) {
    const commentFromDb = await this._commentRepository.getCommentById(
      useCaseCommentId
    );
    const { username: commentUsername, fullname: commentFullname } =
      await this._userRepository.getUserById(commentFromDb.user_id);

    const commentDetails = new CommentDetails({
      id: commentFromDb.id,
      content: commentFromDb.content,
      date: commentFromDb.created_at.toString(),
      username: commentUsername,
      fullname: commentFullname,
      replies: [],
    });

    const repliesInComment =
      await this._commentReplyRepository.getCommentReplyByCommentId(
        commentDetails.id
      );

    if (repliesInComment.length > 0) {
      for (const replyData of repliesInComment) {
        const { username: replyUsername, fullname: replyFullname } =
          await this._userRepository.getUserById(replyData.user_id);
        const commentReplyDetails = new CommentReplyDetails({
          id: replyData.id,
          content: replyData.content,
          date: replyData.created_at.toString(),
          username: replyUsername,
          fullname: replyFullname,
        });

        commentDetails.replies.push(commentReplyDetails);
      }
    }

    return commentDetails;
  }
}

module.exports = GetDetailsCommentUseCase;

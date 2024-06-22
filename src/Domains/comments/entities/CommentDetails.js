class CommentDetails {
  constructor(payload) {
    this._verifyPayload(payload);
    const { id, content, date, username, likeCount, replies } = payload;
    this.id = id;
    this.content = content;
    this.date = date;
    this.username = username;
    this.likeCount = likeCount;
    this.replies = replies;
  }

  _verifyPayload({ id, content, date, username, likeCount, replies }) {
    if (!id || !content || !date || !username || !likeCount || !replies) {
      throw new Error("COMMENT_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof id !== "string" ||
      typeof content !== "string" ||
      typeof date !== "string" ||
      typeof username !== "string" ||
      typeof likeCount !== "number" ||
      !Array.isArray(replies)
    ) {
      throw new Error("COMMENT_DETAILS.PROPERTY_HAVE_WRONG_DATA_TYPE");
    }
  }
}

module.exports = CommentDetails;

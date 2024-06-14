class CommentDetails {
  constructor(payload) {
    this._verifyPayload(payload);
    const { id, content, date, username, fullname, replies } = payload;
    this.id = id;
    this.content = content;
    this.date = date;
    this.username = username;
    this.fullname = fullname;
    this.replies = replies;
  }

  _verifyPayload({ id, content, date, username, fullname, replies }) {
    if (!id || !content || !date || !username || !fullname || !replies) {
      throw new Error("COMMENT_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof id !== "string" ||
      typeof content !== "string" ||
      typeof date !== "string" ||
      typeof username !== "string" ||
      typeof fullname !== "string" ||
      !Array.isArray(replies)
    ) {
      throw new Error("COMMENT_DETAILS.PROPERTY_HAVE_WRONG_DATA_TYPE");
    }
  }
}

module.exports = CommentDetails;

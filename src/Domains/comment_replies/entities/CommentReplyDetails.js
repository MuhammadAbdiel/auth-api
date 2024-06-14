class CommentReplyDetails {
  constructor(payload) {
    this._verifyPayload(payload);
    const { id, content, date, username, fullname } = payload;
    this.id = id;
    this.content = content;
    this.date = date;
    this.username = username;
    this.fullname = fullname;
  }

  _verifyPayload({ id, content, date, username, fullname }) {
    if ((!id || !content || !date || !username, !fullname)) {
      throw new Error("COMMENT_REPLY_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof id !== "string" ||
      typeof content !== "string" ||
      typeof date !== "string" ||
      typeof username !== "string" ||
      typeof fullname !== "string"
    ) {
      throw new Error("COMMENT_REPLY_DETAILS.PROPERTY_HAVE_WRONG_DATA_TYPE");
    }
  }
}

module.exports = CommentReplyDetails;

const CommentReplyDetails = require("../CommentReplyDetails");

describe("a CommentReplyDetails", () => {
  it("should throw error when payload did not contain right property", () => {
    // Arrange
    const payload = {
      content: "something",
      date: "something",
      username: "something",
    };

    // Action and Assert
    expect(() => new CommentReplyDetails(payload)).toThrow(
      "COMMENT_REPLY_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload contain wrong data type", () => {
    // Arrange
    const payload = {
      id: "something",
      content: "something",
      date: 123,
      username: "something",
      fullname: "something",
    };

    // Action and Assert
    expect(() => new CommentReplyDetails(payload)).toThrow(
      "COMMENT_REPLY_DETAILS.PROPERTY_HAVE_WRONG_DATA_TYPE"
    );
  });

  it("should get comment reply details correctly", () => {
    // Arrange
    const payload = {
      id: "something",
      content: "something",
      date: "something",
      username: "something",
      fullname: "something",
    };

    // Action
    const commentReplyDetails = new CommentReplyDetails(payload);

    // Assert
    expect(commentReplyDetails.id).toStrictEqual(payload.id);
    expect(commentReplyDetails.content).toStrictEqual(payload.content);
    expect(commentReplyDetails.date).toStrictEqual(payload.date);
    expect(commentReplyDetails.username).toStrictEqual(payload.username);
    expect(commentReplyDetails).toBeDefined();
  });
});

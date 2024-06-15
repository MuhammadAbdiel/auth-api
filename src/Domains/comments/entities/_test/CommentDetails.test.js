const CommentDetails = require("../CommentDetails");

describe("a CommentDetails", () => {
  it("should throw error when payload did not contain right property", () => {
    // Arrange
    const payload = {
      content: "something",
      date: "something",
      username: "something",
      fullname: "something",
      replies: [],
    };

    // Action and Assert
    expect(() => new CommentDetails(payload)).toThrow(
      "COMMENT_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload contain wrong data type", () => {
    // Arrange
    const payload = {
      id: "something",
      content: "something",
      date: "something",
      username: "something",
      fullname: "something",
      replies: "[]",
    };

    // Action and Assert
    expect(() => new CommentDetails(payload)).toThrow(
      "COMMENT_DETAILS.PROPERTY_HAVE_WRONG_DATA_TYPE"
    );
  });

  it("should throw error when payload contain wrong data type", () => {
    // Arrange
    const payload = {
      id: "something",
      content: "something",
      date: "something",
      username: "something",
      fullname: "something",
      replies: [],
    };

    // Action
    const commentDetails = new CommentDetails(payload);

    // Assert
    expect(commentDetails.id).toEqual(payload.id);
    expect(commentDetails.content).toEqual(payload.content);
    expect(commentDetails.date).toEqual(payload.date);
    expect(commentDetails.username).toEqual(payload.username);
    expect(commentDetails.replies).toEqual(payload.replies);
    expect(commentDetails).toBeDefined();
  });
});

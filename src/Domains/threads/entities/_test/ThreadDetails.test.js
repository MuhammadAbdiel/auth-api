const ThreadDetails = require("../ThreadDetails");

describe("a ThreadDetails", () => {
  it("should throw error when payload did not contain right property", () => {
    // Arrange
    const payload = {
      title: "something",
      body: "something",
      date: "something",
      username: "something",
      comments: [],
    };

    // Action and Assert
    expect(() => new ThreadDetails(payload)).toThrow(
      "THREAD_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload contain wrong data type", () => {
    // Arrange
    const payload = {
      id: "something",
      title: "something",
      body: "something",
      date: "something",
      username: "something",
      comments: "[]",
    };

    // Action and Assert
    expect(() => new ThreadDetails(payload)).toThrow(
      "THREAD_DETAILS.PROPERTY_HAVE_WRONG_DATA_TYPE"
    );
  });

  it("should get thread details correctly", () => {
    // Arrange
    const payload = {
      id: "something",
      title: "something",
      body: "something",
      date: "something",
      username: "something",
      comments: [],
    };

    // Action
    const threadDetails = new ThreadDetails(payload);

    // Assert
    expect(threadDetails.id).toStrictEqual(payload.id);
    expect(threadDetails.title).toStrictEqual(payload.title);
    expect(threadDetails.body).toStrictEqual(payload.body);
    expect(threadDetails.date).toStrictEqual(payload.date);
    expect(threadDetails.username).toStrictEqual(payload.username);
    expect(threadDetails.comments).toStrictEqual(payload.comments);
    expect(threadDetails).toBeDefined();
  });
});

const NewThread = require("../NewThread");

describe("a NewThread entities", () => {
  it("should throw error when payload did not contain right property", () => {
    // Arrange
    const payload = {
      title: "something",
      content: "something",
    };

    // Action and Assert
    expect(() => new NewThread(payload)).toThrow(
      "NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload contain wrong data type", () => {
    // Arrange
    const payload = {
      title: "something",
      body: 123,
    };

    // Action and Assert
    expect(() => new NewThread(payload)).toThrow(
      "NEW_THREAD.PROPERTY_HAVE_WRONG_DATA_TYPE"
    );
  });

  it("should throw error if the title more than 50 character", () => {
    const payload = {
      title:
        "something longer than 50 character and it really hard to have such an error and you did not find it in your last code",
      body: "this is body",
    };

    // Action and Assert
    expect(() => new NewThread(payload)).toThrow(
      "NEW_THREAD.TITLE_EXCEED_CHAR_LIMIT"
    );
  });

  it("should create new thread correctly", () => {
    // Arrange
    const payload = {
      title: "something",
      body: "this is body",
    };

    // Action
    const newThread = new NewThread(payload);

    // Assert
    expect(newThread).toBeInstanceOf(NewThread);
    expect(newThread.title).toStrictEqual(payload.title);
    expect(newThread.body).toStrictEqual(payload.body);
  });
});

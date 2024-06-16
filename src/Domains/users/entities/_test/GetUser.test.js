const GetUser = require("../GetUser");

describe("GetUser entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      username: "dicoding",
      fullname: "Dicoding Indonesia",
    };

    // Action and Assert
    expect(() => new GetUser(payload)).toThrow(
      "GET_USER.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      id: 123,
      username: "dicoding",
      fullname: {},
    };

    // Action and Assert
    expect(() => new GetUser(payload)).toThrow(
      "GET_USER.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create getUser object correctly", () => {
    // Arrange
    const payload = {
      id: "user-123",
      username: "dicoding",
      fullname: "Dicoding Indonesia",
    };

    // Action
    const getUser = new GetUser(payload);

    // Assert
    expect(getUser.id).toStrictEqual(payload.id);
    expect(getUser.username).toStrictEqual(payload.username);
    expect(getUser.fullname).toStrictEqual(payload.fullname);
  });
});

const GetOwnProfile = require("../GetOwnProfile");

describe("a GetOwnProfile entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      username: "dicoding",
      fullname: "Dicoding Indonesia",
    };

    // Action and Assert
    expect(() => new GetOwnProfile(payload)).toThrow(
      "GET_OWN_PROFILE.NOT_CONTAIN_NEEDED_PROPERTY"
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
    expect(() => new GetOwnProfile(payload)).toThrow(
      "GET_OWN_PROFILE.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create getOwnProfile object correctly", () => {
    // Arrange
    const payload = {
      id: "user-123",
      username: "dicoding",
      fullname: "Dicoding Indonesia",
    };

    // Action
    const getOwnProfile = new GetOwnProfile(payload);

    // Assert
    expect(getOwnProfile.id).toEqual(payload.id);
    expect(getOwnProfile.username).toEqual(payload.username);
    expect(getOwnProfile.fullname).toEqual(payload.fullname);
  });
});

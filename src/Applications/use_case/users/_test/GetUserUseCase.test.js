const UserRepository = require("../../../../Domains/users/UserRepository");
const GetUserUseCase = require("../GetUserUseCase");

describe("GetUserUseCase", () => {
  it("should orchestrating the get user action correctly", async () => {
    // Arrange
    const useCasePayload = {
      id: "user-123",
    };
    const mockUserRepository = new UserRepository();
    mockUserRepository.getOwnProfile = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve({ id: "user-123", username: "dicoding" })
      );
    const getUserUseCase = new GetUserUseCase({
      userRepository: mockUserRepository,
    });

    // Action
    const getUser = await getUserUseCase.execute(useCasePayload.id);

    // Assert
    expect(mockUserRepository.getOwnProfile).toHaveBeenCalledWith(
      useCasePayload.id
    );
    expect(getUser).toStrictEqual({ id: "user-123", username: "dicoding" });
  });
});

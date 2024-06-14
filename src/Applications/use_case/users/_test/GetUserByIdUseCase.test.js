const UserRepository = require("../../../../Domains/users/UserRepository");
const GetUserByIdUseCase = require("../GetUserByIdUseCase");

describe("GetUserByIdUseCase", () => {
  it("should orchestrating the get user action correctly", async () => {
    // Arrange
    const useCasePayload = {
      id: "user-123",
    };
    const mockUserRepository = new UserRepository();
    mockUserRepository.getUserById = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve({ id: "user-123", username: "dicoding" })
      );
    const getUserByIdUseCase = new GetUserByIdUseCase({
      userRepository: mockUserRepository,
    });

    // Action
    const getUser = await getUserByIdUseCase.execute(useCasePayload.id);

    // Assert
    expect(mockUserRepository.getUserById).toHaveBeenCalledWith(
      useCasePayload.id
    );
    expect(getUser).toStrictEqual({ id: "user-123", username: "dicoding" });
  });
});

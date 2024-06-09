const GetAllThreadUseCase = require("../GetAllThreadUseCase");
const ThreadRepository = require("../../../../Domains/threads/ThreadRepository");
const UserRepository = require("../../../../Domains/users/UserRepository");

describe("GetAllThreadUseCase", () => {
  it("should orchestrate the get all thread action", async () => {
    // Arrange
    const userArnold = {
      id: "user-111",
      username: "ArnoldSzechuan",
      fullname: "Arnold Szechuan",
    };

    const mockThreadData = [
      {
        id: "thread-123",
        title: "this is title thread",
        body: "this is body",
        created_at: "2023-07-18 20:38:31.448",
        user_id: "user-111",
      },
      {
        id: "thread-456",
        title: "this is title thread",
        body: "this is body",
        created_at: "2023-07-18 20:38:31.448",
        user_id: "user-111",
      },
    ];

    const expectedThreadData = mockThreadData.map((thread) => ({
      id: thread.id,
      title: thread.title,
      body: thread.body,
      date: thread.created_at,
      user: {
        username: userArnold.username,
        fullname: userArnold.fullname,
      },
    }));

    const mockThreadRepository = new ThreadRepository();
    const mockUserRepository = new UserRepository();

    /** mocking needed function */
    mockThreadRepository.getAllThread = jest
      .fn()
      .mockResolvedValue(mockThreadData);
    mockUserRepository.getUserById = jest.fn().mockImplementation((userId) => {
      if (userId === "user-111") {
        return Promise.resolve(userArnold);
      }
    });

    const getAllThreadUseCase = new GetAllThreadUseCase({
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
    });

    // Action
    const threads = await getAllThreadUseCase.execute();

    // Assert
    expect(threads).toStrictEqual(expectedThreadData);
    expect(mockThreadRepository.getAllThread).toHaveBeenCalled();
    expect(mockUserRepository.getUserById).toHaveBeenCalledWith("user-111");
  });
});

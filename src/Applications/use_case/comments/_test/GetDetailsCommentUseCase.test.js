const CommentReplyRepository = require("../../../../Domains/comment_replies/CommentReplyRepository");
const CommentRepository = require("../../../../Domains/comments/CommentRepository");
const UserRepository = require("../../../../Domains/users/UserRepository");

const GetDetailsCommentUseCase = require("../GetDetailsCommentUseCase");

describe("GetDetailsCommentUseCase", () => {
  it("should orchestrate get the details comment", async () => {
    // Arrange
    const userArnold = {
      id: "user-111",
      username: "Arnold Szechuan",
      fullname: "Arnold Szechuan",
    };

    const userDhh = {
      id: "user-222",
      username: "DHH",
      fullname: "David Heinemeier Hansson",
    };

    const commentData = {
      id: "comment-123",
      content: "this is first",
      created_at: new Date("2023-08-17T20:38:31.448Z"),
      user_id: "user-111",
      thread_id: "thread-123",
      is_delete: false,
    };

    const replyData = [
      {
        id: "reply-123",
        content: "this is first reply",
        created_at: new Date("2023-08-18T20:38:31.448Z"),
        user_id: "user-222",
        comment_id: "comment-123",
        is_delete: false,
      },
      {
        id: "reply-124",
        content: "this is second reply",
        created_at: new Date("2023-08-18T20:38:31.448Z"),
        user_id: "user-111",
        comment_id: "comment-123",
        is_delete: false,
      },
      {
        id: "reply-125",
        content: "this is third reply",
        created_at: new Date("2023-08-18T20:38:31.448Z"),
        user_id: "user-111",
        comment_id: "comment-123",
        is_delete: false,
      },
      {
        id: "reply-126",
        content: "this is fourth reply",
        created_at: new Date("2023-08-18T20:38:31.448Z"),
        user_id: "user-111",
        comment_id: "comment-123",
        is_delete: false,
      },
    ];

    /** creating dependency of use case */
    const mockCommentReplyRepository = new CommentReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockUserRepository = new UserRepository();

    /** mocking needed function */
    mockCommentRepository.getCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(commentData));
    mockUserRepository.getUserById = jest.fn().mockImplementation((userId) => {
      if (userId === "user-111") {
        return Promise.resolve(userArnold);
      }
      if (userId === "user-222") {
        return Promise.resolve(userDhh);
      }
    });
    mockCommentReplyRepository.getCommentReplyByCommentId = jest
      .fn()
      .mockImplementation((commentId) => {
        if (commentId === "comment-123") {
          return Promise.resolve(replyData);
        }
        return Promise.resolve([]);
      });

    /** create use case instance */
    const getDetailsCommentUseCase = new GetDetailsCommentUseCase({
      commentReplyRepository: mockCommentReplyRepository,
      commentRepository: mockCommentRepository,
      userRepository: mockUserRepository,
    });

    // Action
    const commentDetails = await getDetailsCommentUseCase.execute(
      "comment-123"
    );

    // Assert
    expect(commentDetails.replies).toHaveLength(4);
    expect(commentDetails.replies[0].username).toBe(userDhh.username);
    expect(commentDetails.replies[1].username).toBe(userArnold.username);
  });

  it("should orchestrate get the details comment if there are no replies", async () => {
    // Arrange
    const userArnold = {
      id: "user-111",
      username: "Arnold Szechuan",
      fullname: "Arnold Szechuan",
    };

    const userDhh = {
      id: "user-222",
      username: "DHH",
      fullname: "David Heinemeier Hansson",
    };

    const commentData = {
      id: "comment-123",
      content: "this is first",
      created_at: new Date("2023-08-17T20:38:31.448Z"),
      user_id: "user-111",
      thread_id: "thread-123",
      is_delete: false,
    };

    const replyData = [];

    /** creating dependency of use case */
    const mockCommentReplyRepository = new CommentReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockUserRepository = new UserRepository();

    /** mocking needed function */
    mockCommentRepository.getCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(commentData));
    mockUserRepository.getUserById = jest.fn().mockImplementation((userId) => {
      if (userId === "user-111") {
        return Promise.resolve(userArnold);
      }
      if (userId === "user-222") {
        return Promise.resolve(userDhh);
      }
    });
    mockCommentReplyRepository.getCommentReplyByCommentId = jest
      .fn()
      .mockImplementation((commentId) => {
        if (commentId === "comment-123") {
          return Promise.resolve(replyData);
        }
        return Promise.resolve([]);
      });

    /** create use case instance */
    const getDetailsCommentUseCase = new GetDetailsCommentUseCase({
      commentReplyRepository: mockCommentReplyRepository,
      commentRepository: mockCommentRepository,
      userRepository: mockUserRepository,
    });

    // Action
    const commentDetails = await getDetailsCommentUseCase.execute(
      "comment-123"
    );

    // Assert
    expect(commentDetails.replies).toHaveLength(0);
  });
});

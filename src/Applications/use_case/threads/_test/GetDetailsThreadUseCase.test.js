const CommentReplyRepository = require("../../../../Domains/comment_replies/CommentReplyRepository");
const CommentReplyDetails = require("../../../../Domains/comment_replies/entities/CommentReplyDetails");
const CommentRepository = require("../../../../Domains/comments/CommentRepository");
const CommentDetails = require("../../../../Domains/comments/entities/CommentDetails");
const ThreadDetails = require("../../../../Domains/threads/entities/ThreadDetails");
const ThreadRepository = require("../../../../Domains/threads/ThreadRepository");
const UserRepository = require("../../../../Domains/users/UserRepository");

const GetDetailsThreadUseCase = require("../GetDetailsThreadUseCase");

describe("GetDetailsThreadUseCase", () => {
  it("should orchestrate get the details thread", async () => {
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

    const mockThreadData = {
      id: "thread-123",
      title: "this is title thread",
      body: "this is body",
      created_at: new Date("2023-07-18T20:38:31.448Z"),
      user_id: "user-111",
    };

    const commentData = [
      {
        id: "comment-123",
        content: "this is first",
        created_at: new Date("2023-08-17T20:38:31.448Z"),
        user_id: "user-111",
        thread_id: "thread-123",
        is_delete: false,
      },
      {
        id: "comment-222",
        content: "this is second without reply",
        created_at: new Date("2023-08-17T20:38:31.448Z"),
        user_id: "user-111",
        thread_id: "thread-123",
        is_delete: false,
      },
      {
        id: "comment-333",
        content: "this is third without reply",
        created_at: new Date("2023-08-17T20:38:31.448Z"),
        user_id: "user-111",
        thread_id: "thread-123",
        is_delete: false,
      },
    ];

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
    const mockThreadRepository = new ThreadRepository();
    const mockUserRepository = new UserRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockThreadData));
    mockUserRepository.getUserById = jest.fn().mockImplementation((userId) => {
      if (userId === "user-111") {
        return Promise.resolve(userArnold);
      }
      if (userId === "user-222") {
        return Promise.resolve(userDhh);
      }
    });
    mockCommentRepository.getCommentByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(commentData));
    mockCommentReplyRepository.getCommentReplyByCommentId = jest
      .fn()
      .mockImplementation((commentId) => {
        if (commentId === "comment-123") {
          return Promise.resolve(replyData);
        }
        return Promise.resolve([]);
      });

    /** create use case instance */
    const getDetailsThreadUseCase = new GetDetailsThreadUseCase({
      commentReplyRepository: mockCommentReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
    });

    // Action
    const threadDetails = await getDetailsThreadUseCase.execute("thread-123");

    // Assert
    expect(threadDetails.comments).toHaveLength(3);
    expect(threadDetails.comments[0].replies).toHaveLength(4);
    expect(threadDetails.comments[0].replies[0].username).toBe(
      userDhh.username
    );
    expect(threadDetails.comments[0].replies[1].username).toBe(
      userArnold.username
    );
  });

  it("should orchestrate get the details thread if there are no comments", async () => {
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

    const mockThreadData = {
      id: "thread-123",
      title: "this is title thread",
      body: "this is body",
      created_at: new Date("2023-07-18T20:38:31.448Z"),
      user_id: "user-111",
    };

    const commentData = [];

    /** creating dependency of use case */
    const mockCommentReplyRepository = new CommentReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockUserRepository = new UserRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockThreadData));
    mockUserRepository.getUserById = jest.fn().mockImplementation((userId) => {
      if (userId === "user-111") {
        return Promise.resolve(userArnold);
      }
      if (userId === "user-222") {
        return Promise.resolve(userDhh);
      }
    });
    mockCommentRepository.getCommentByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(commentData));

    /** create use case instance */
    const getDetailsThreadUseCase = new GetDetailsThreadUseCase({
      commentReplyRepository: mockCommentReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
    });

    // Action
    const threadDetails = await getDetailsThreadUseCase.execute("thread-123");

    // Assert
    expect(threadDetails.comments).toHaveLength(0);
  });
});

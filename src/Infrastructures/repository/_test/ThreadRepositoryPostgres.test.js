const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AddedThread = require("../../../Domains/threads/entities/AddedThread");
const NewThread = require("../../../Domains/threads/entities/NewThread");
const pool = require("../../database/postgres/pool");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");

describe("ThreadRepositoryPostgres", () => {
  // Pre-requisite
  const userId = "user-123";

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: userId });
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe("addNewThread function", () => {
    it("should persist added thread ", async () => {
      //Arrange
      const newThread = new NewThread({
        title: "First thread",
        body: "This is a new thread",
      });

      const fakeIdGenerator = () => "123";
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      //Action
      await threadRepositoryPostgres.addNewThread(newThread, userId);

      //Assert
      const threads = await ThreadsTableTestHelper.findThreadById("thread-123");

      expect(threads).toHaveLength(1);
    });

    it("should return thread correctly", async () => {
      //Arrange

      const newThread = new NewThread({
        title: "First thread",
        body: "This is a new thread",
      });

      const fakeIdGenerator = () => "123";
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      //Action
      const addedThread = await threadRepositoryPostgres.addNewThread(
        newThread,
        userId
      );

      //Assert

      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: "thread-123",
          title: "First thread",
          owner: "user-123",
        })
      );
    });
  });

  describe("getThreads function", () => {
    it("should return all threads", async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({
        id: "thread-521",
        title: "Thread test",
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const threads = await threadRepositoryPostgres.getAllThread();

      // Assert
      expect(threads).toHaveLength(1);
      expect(threads[0].id).toEqual("thread-521");
      expect(threads[0].title).toEqual("Thread test");
      expect(threads[0].body).toEqual("This is helper thread");
      expect(threads[0].created_at).toEqual(
        new Date("2024-06-13T00:00:00.000Z")
      );
      expect(threads[0].user_id).toEqual("user-123");
    });
  });

  describe("getThreadById function", () => {
    it("should throw NotFoundError if no thread found", async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        threadRepositoryPostgres.getThreadById("thread-521")
      ).rejects.toThrow(NotFoundError);
    });

    it("should get the right thread", async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({
        id: "thread-521",
        title: "Thread test",
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const thread = await threadRepositoryPostgres.getThreadById("thread-521");

      // Assert
      expect(thread).toEqual({
        id: "thread-521",
        title: "Thread test",
        body: "This is helper thread",
        created_at: new Date("2024-06-13T00:00:00.000Z"),
        user_id: "user-123",
      });
    });
  });

  describe("verifyThreadAvailability function", () => {
    it("should throw NotFoundError if no thread found", async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        threadRepositoryPostgres.verifyThreadAvailability("thread-521")
      ).rejects.toThrow(NotFoundError);
    });

    it("should not throw NotFoundError if thread found", async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({
        id: "thread-521",
        title: "Thread test",
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        threadRepositoryPostgres.verifyThreadAvailability("thread-521")
      ).resolves.not.toThrow(NotFoundError);
    });
  });
});

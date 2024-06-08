class ThreadRepository {
  async addNewThread(thread, ownerId) {
    throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async getAllThread() {
    throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async getThreadById(threadId) {
    throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
}

module.exports = ThreadRepository;

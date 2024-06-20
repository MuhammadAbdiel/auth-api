const InvariantError = require("../../../Commons/exceptions/InvariantError");

class GetAllThreadUseCase {
  constructor({ threadRepository, userRepository }) {
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
  }

  async execute() {
    // get all threads
    const threadsFromDb = await this._threadRepository.getAllThread();
    // get user for each thread
    const threadsWithUsernames = await Promise.all(
      threadsFromDb.map(async (thread) => {
        const { username, fullname } = await this._userRepository.getUserById(
          thread.user_id
        );

        const response = {
          ...thread,
          date: thread.created_at, // assuming created_at is the intended date field
          user: {
            username,
            fullname,
          },
        };
        delete response.created_at;
        delete response.user_id;

        return response;
      })
    );
    return threadsWithUsernames; // directly returning the array of threads
  }
}

module.exports = GetAllThreadUseCase;

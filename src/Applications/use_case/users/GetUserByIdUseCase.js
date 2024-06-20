const InvariantError = require("../../../Commons/exceptions/InvariantError");

class GetUserUseCase {
  constructor({ userRepository }) {
    this._userRepository = userRepository;
  }

  async execute(userId) {
    return await this._userRepository.getUserById(userId);
  }
}

module.exports = GetUserUseCase;

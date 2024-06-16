const InvariantError = require("../../../Commons/exceptions/InvariantError");

class GetUserUseCase {
  constructor({ userRepository }) {
    this._userRepository = userRepository;
  }

  async execute(userId) {
    const user = await this._userRepository.getUserById(userId);
    if (!user) {
      throw new InvariantError("User not found");
    }

    return user;
  }
}

module.exports = GetUserUseCase;

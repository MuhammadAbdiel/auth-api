class GetUserUseCase {
  constructor({ userRepository }) {
    this._userRepository = userRepository;
  }

  async execute(userId) {
    return this._userRepository.getUserById(userId);
  }
}

module.exports = GetUserUseCase;

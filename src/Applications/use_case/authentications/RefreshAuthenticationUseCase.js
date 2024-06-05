class RefreshAuthenticationUseCase {
<<<<<<< HEAD
  constructor({ authenticationRepository, authenticationTokenManager }) {
=======
  constructor({
    authenticationRepository,
    authenticationTokenManager,
  }) {
>>>>>>> 340eaf15390629b04c6d8422525c2d97a3a12fc1
    this._authenticationRepository = authenticationRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCasePayload) {
    this._verifyPayload(useCasePayload);
    const { refreshToken } = useCasePayload;

    await this._authenticationTokenManager.verifyRefreshToken(refreshToken);
    await this._authenticationRepository.checkAvailabilityToken(refreshToken);

<<<<<<< HEAD
    const { username } = await this._authenticationTokenManager.decodePayload(
      refreshToken
    );

    return this._authenticationTokenManager.createAccessToken({ username });
=======
    const { username, id } = await this._authenticationTokenManager.decodePayload(refreshToken);

    return this._authenticationTokenManager.createAccessToken({ username, id });
>>>>>>> 340eaf15390629b04c6d8422525c2d97a3a12fc1
  }

  _verifyPayload(payload) {
    const { refreshToken } = payload;

    if (!refreshToken) {
<<<<<<< HEAD
      throw new Error(
        "REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN"
      );
    }

    if (typeof refreshToken !== "string") {
      throw new Error(
        "REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION"
      );
=======
      throw new Error('REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN');
    }

    if (typeof refreshToken !== 'string') {
      throw new Error('REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
>>>>>>> 340eaf15390629b04c6d8422525c2d97a3a12fc1
    }
  }
}

module.exports = RefreshAuthenticationUseCase;

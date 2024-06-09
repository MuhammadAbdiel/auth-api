class GetOwnProfile {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, username, fullname } = payload;

    this.id = id;
    this.username = username;
    this.fullname = fullname;
  }

  _verifyPayload({ id, username, fullname }) {
    if (!id || !username || !fullname) {
      throw new Error("GET_OWN_PROFILE.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof id !== "string" ||
      typeof username !== "string" ||
      typeof fullname !== "string"
    ) {
      throw new Error("GET_OWN_PROFILE.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = GetOwnProfile;

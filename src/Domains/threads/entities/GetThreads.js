class GetThreads {
  constructor(payload) {
    this._verifyPayload(payload);
    this.threads = payload.map(({ id, title, body, date, username }) => ({
      id,
      title,
      body,
      date,
      username,
    }));
  }

  _verifyPayload(payload) {
    if (!Array.isArray(payload)) {
      throw new Error("GET_THREADS.PROPERTY_HAVE_WRONG_DATA_TYPE");
    }

    payload.forEach(({ id, title, body, date, username }) => {
      if (!id || !title || !body || !date || !username) {
        throw new Error("GET_THREADS.NOT_CONTAIN_NEEDED_PROPERTY");
      }

      if (
        typeof id !== "string" ||
        typeof title !== "string" ||
        typeof body !== "string" ||
        typeof date !== "string" ||
        typeof username !== "string"
      ) {
        throw new Error("GET_THREADS.PROPERTY_HAVE_WRONG_DATA_TYPE");
      }
    });
  }
}

module.exports = GetThreads;

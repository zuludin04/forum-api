class Thread {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, title, owner } = payload;

    this.id = id;
    this.title = title;
    this.owner = owner;
  }

  _verifyPayload({ id, title, owner }) {
    if (!id || !title || !owner) {
      throw new Error("THREAD.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof id !== "string" ||
      typeof title !== "string" ||
      typeof owner !== "string"
    ) {
      throw new Error("THREAD.NOT_MEET_DATA_SPECIFICATION");
    }
  }
}

module.exports = Thread;

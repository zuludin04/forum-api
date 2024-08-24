class NewComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { content, owner, thread } = payload;

    this.content = content;
    this.owner = owner;
    this.thread = thread;
  }

  _verifyPayload({ content, owner, thread }) {
    if (!content || !owner || !thread) {
      throw new Error("NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof content !== "string" ||
      typeof content !== "string" ||
      typeof thread !== "string"
    ) {
      throw new Error("NEW_COMMENT.NOT_MEET_DATA_SPECIFICATION");
    }
  }
}

module.exports = NewComment;

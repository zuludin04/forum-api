class DetailComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, content, date, username, isDeleted } = payload;

    this.id = id;
    this.content = isDeleted == 1 ? "**komentar telah dihapus**" : content;
    this.date = date;
    this.username = username;
  }

  _verifyPayload({ id, content, date, username, isDeleted }) {
    if (!id || !content || !date || !username || isDeleted === null) {
      throw new Error("DETAIL_COMMENT.DID_NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof id !== "string" ||
      typeof content !== "string" ||
      typeof date !== "string" ||
      typeof username !== "string" ||
      typeof isDeleted !== "number"
    ) {
      throw new Error("DETAIL_COMMENT.DID_NOT_MEET_DATA_SPECIFICATION");
    }
  }
}

module.exports = DetailComment;

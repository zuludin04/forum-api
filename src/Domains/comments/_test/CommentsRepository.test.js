const CommentsRepository = require("../CommentsRepository");

describe("CommentsRepository interface", () => {
  it("should throw error when invoke unimplemented method", async () => {
    const commentsRepository = new CommentsRepository();

    await expect(commentsRepository.addComment({})).rejects.toThrowError(
      "COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });

  it("should throw error when invoke unimplemented method", async () => {
    const commentsRepository = new CommentsRepository();

    await expect(commentsRepository.softDeleteComment({})).rejects.toThrowError(
      "COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });

  it("should throw error when invoke unimplemented method", async () => {
    const commentsRepository = new CommentsRepository();

    await expect(commentsRepository.commentsByThread("")).rejects.toThrowError(
      "COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });
});

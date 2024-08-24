const AddCommentUseCase = require("../../../../Applications/use_case/AddCommentUseCase");
const AddThreadUseCase = require("../../../../Applications/use_case/AddThreadUseCase");
const DeleteCommentUseCase = require("../../../../Applications/use_case/DeleteCommentUseCase");
const DetailThreadUseCase = require("../../../../Applications/use_case/DetailThreadUseCase");

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postAddThreadHandler = this.postAddThreadHandler.bind(this);
    this.postAddCommentThreadHandler =
      this.postAddCommentThreadHandler.bind(this);
    this.deleteThreadCommentHandler =
      this.deleteThreadCommentHandler.bind(this);
    this.getThreadDetailHandler = this.getThreadDetailHandler.bind(this);
  }

  async postAddThreadHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const thread = await addThreadUseCase.execute(userId, request.payload);

    const response = h.response({
      status: "success",
      data: {
        addedThread: thread,
      },
    });
    response.code(201);
    return response;
  }

  async postAddCommentThreadHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const { content } = request.payload;
    const { threadId } = request.params;
    const payload = { content: content, thread: threadId };

    const addCommentUseCase = this._container.getInstance(
      AddCommentUseCase.name
    );
    const comment = await addCommentUseCase.execute(userId, payload);

    const response = h.response({
      status: "success",
      data: {
        addedComment: comment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteThreadCommentHandler(request) {
    const { id: userId } = request.auth.credentials;
    const payload = request.params;

    const deleteCommentUseCase = this._container.getInstance(
      DeleteCommentUseCase.name
    );
    await deleteCommentUseCase.execute(userId, payload);
    return {
      status: "success",
    };
  }

  async getThreadDetailHandler(request, h) {
    const { threadId } = request.params;

    const detailThreadUseCase = this._container.getInstance(
      DetailThreadUseCase.name
    );
    const result = await detailThreadUseCase.execute(threadId);

    return {
      status: "success",
      data: {
        thread: result,
      },
    };
  }
}

module.exports = ThreadsHandler;

const NewThread = require("../../Domains/threads/entities/NewThread");

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(id, useCasePayload) {
    const payload = {
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: id,
    };
    const newThread = new NewThread(payload);
    return this._threadRepository.addThread(newThread);
  }
}

module.exports = AddThreadUseCase;

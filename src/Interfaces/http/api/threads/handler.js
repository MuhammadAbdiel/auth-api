const AddThreadUseCase = require("../../../../Applications/use_case/threads/AddThreadUseCase");
const GetAllThreadUseCase = require("../../../../Applications/use_case/threads/GetAllThreadUseCase");
const GetDetailsThreadUseCase = require("../../../../Applications/use_case/threads/GetDetailsThreadUseCase");

class ThreadHandler {
  constructor(container) {
    this._container = container;
    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadsHandler = this.getThreadsHandler.bind(this);
    this.getThreadDetailsHandler = this.getThreadDetailsHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const { id: userId } = request.auth.credentials;
    const addedThread = await addThreadUseCase.execute(request.payload, userId);
    const response = h.response({
      status: "success",
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadsHandler(request, h) {
    const getThreadsUseCase = this._container.getInstance(
      GetAllThreadUseCase.name
    );
    const threads = await getThreadsUseCase.execute();
    const response = h.response({
      status: "success",
      data: {
        threads,
      },
    });

    return response;
  }

  async getThreadDetailsHandler(request, h) {
    const getDetailsThreadUseCase = this._container.getInstance(
      GetDetailsThreadUseCase.name
    );
    const { threadId } = request.params;
    const thread = await getDetailsThreadUseCase.execute(threadId);
    const response = h.response({
      status: "success",
      data: { thread },
    });

    return response;
  }
}

module.exports = ThreadHandler;

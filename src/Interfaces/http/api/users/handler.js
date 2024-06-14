const AddUserUseCase = require("../../../../Applications/use_case/users/AddUserUseCase");
const GetUserUseCase = require("../../../../Applications/use_case/users/GetUserUseCase");
const GetUserByIdUseCase = require("../../../../Applications/use_case/users/GetUserByIdUseCase");

class UsersHandler {
  constructor(container) {
    this._container = container;

    this.postUserHandler = this.postUserHandler.bind(this);
    this.getOwnProfileHandler = this.getOwnProfileHandler.bind(this);
    this.getUserByIdHandler = this.getUserByIdHandler.bind(this);
  }

  async postUserHandler(request, h) {
    const addUserUseCase = this._container.getInstance(AddUserUseCase.name);
    const addedUser = await addUserUseCase.execute(request.payload);

    const response = h.response({
      status: "success",
      data: {
        addedUser,
      },
    });
    response.code(201);
    return response;
  }

  async getOwnProfileHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const getUserUseCase = this._container.getInstance(GetUserUseCase.name);
    const user = await getUserUseCase.execute(userId);

    const response = h.response({
      status: "success",
      data: {
        user,
      },
    });

    return response;
  }

  async getUserByIdHandler(request, h) {
    const { userId } = request.params;
    const getUserByIdUseCase = this._container.getInstance(
      GetUserByIdUseCase.name
    );
    const user = await getUserByIdUseCase.execute(userId);

    const response = h.response({
      status: "success",
      data: {
        user,
      },
    });

    return response;
  }
}

module.exports = UsersHandler;

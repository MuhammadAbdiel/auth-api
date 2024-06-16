const pool = require("../../database/postgres/pool");
const {
  injection,
  addUserOption,
  addAuthOption,
} = require("../../../../tests/ServerInjectionFunctionHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AuthenticationTokenManager = require("../../../Applications/security/AuthenticationTokenManager");
const container = require("../../container");
const createServer = require("../createServer");

describe("/users endpoint", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  describe("when POST /users", () => {
    it("should response 201 and persisted user", async () => {
      // Arrange
      const requestPayload = {
        username: "dicoding",
        password: "secret",
        fullname: "Dicoding Indonesia",
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/users",
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(201);
      expect(responseJson.status).toStrictEqual("success");
      expect(responseJson.data.addedUser).toBeDefined();
    });

    it("should response 400 when request payload not contain needed property", async () => {
      // Arrange
      const requestPayload = {
        fullname: "Dicoding Indonesia",
        password: "secret",
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/users",
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(400);
      expect(responseJson.status).toStrictEqual("fail");
      expect(responseJson.message).toStrictEqual(
        "tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada"
      );
    });

    it("should response 400 when request payload not meet data type specification", async () => {
      // Arrange
      const requestPayload = {
        username: "dicoding",
        password: "secret",
        fullname: ["Dicoding Indonesia"],
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/users",
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(400);
      expect(responseJson.status).toStrictEqual("fail");
      expect(responseJson.message).toStrictEqual(
        "tidak dapat membuat user baru karena tipe data tidak sesuai"
      );
    });

    it("should response 400 when username more than 50 character", async () => {
      // Arrange
      const requestPayload = {
        username: "dicodingindonesiadicodingindonesiadicodingindonesiadicoding",
        password: "secret",
        fullname: "Dicoding Indonesia",
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/users",
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(400);
      expect(responseJson.status).toStrictEqual("fail");
      expect(responseJson.message).toStrictEqual(
        "tidak dapat membuat user baru karena karakter username melebihi batas limit"
      );
    });

    it("should response 400 when username contain restricted character", async () => {
      // Arrange
      const requestPayload = {
        username: "dicoding indonesia",
        password: "secret",
        fullname: "Dicoding Indonesia",
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/users",
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(400);
      expect(responseJson.status).toStrictEqual("fail");
      expect(responseJson.message).toStrictEqual(
        "tidak dapat membuat user baru karena username mengandung karakter terlarang"
      );
    });

    it("should response 400 when username unavailable", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: "dicoding" });
      const requestPayload = {
        username: "dicoding",
        fullname: "Dicoding Indonesia",
        password: "super_secret",
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/users",
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(400);
      expect(responseJson.status).toStrictEqual("fail");
      expect(responseJson.message).toStrictEqual("username tidak tersedia");
    });
  });

  describe("when GET /users/me", () => {
    it("should response 200 and return user details", async () => {
      // Arrange
      const userPayload = {
        username: "dicoding",
        password: "secret",
        fullname: "Dicoding Indonesia",
      };

      const loginPayload = {
        username: "dicoding",
        password: "secret",
      };

      const server = await createServer(container);

      // Add account
      await injection(server, addUserOption(userPayload));
      // login
      const auth = await injection(server, addAuthOption(loginPayload));
      const authToken = JSON.parse(auth.payload)?.data?.accessToken;

      // Action
      const response = await server.inject({
        method: "GET",
        url: "/users/me",
        headers: { Authorization: `Bearer ${authToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(200);
      expect(responseJson.status).toStrictEqual("success");
      expect(responseJson.data.user).toBeDefined();
    });

    it("should response 401 when access token not provided", async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "GET",
        url: "/users/me",
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(401);
      expect(responseJson.error).toStrictEqual("Unauthorized");
    });

    it("should response 401 when access token invalid", async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "GET",
        url: "/users/me",
        headers: { Authorization: "Bearer invalid_access_token" },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(401);
      expect(responseJson.error).toStrictEqual("Unauthorized");
    });

    it("should response 400 when user not found", async () => {
      // Arrange
      const accessToken = await container
        .getInstance(AuthenticationTokenManager.name)
        .createAccessToken({ id: "non_existent_user" });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "GET",
        url: "/users/me",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(400);
      expect(responseJson.status).toStrictEqual("fail");
    });
  });

  describe("when GET /users/{userId}", () => {
    it("should response 200 and return user details", async () => {
      // Arrange
      const userPayload = {
        username: "dicoding",
        password: "secret",
        fullname: "Dicoding Indonesia",
      };

      const loginPayload = {
        username: "dicoding",
        password: "secret",
      };

      const server = await createServer(container);

      // Add account
      const user = await injection(server, addUserOption(userPayload));
      // login
      const auth = await injection(server, addAuthOption(loginPayload));
      const authToken = JSON.parse(auth.payload)?.data?.accessToken;
      const userId = JSON.parse(user.payload)?.data?.addedUser.id;

      // Action
      const response = await server.inject({
        method: "GET",
        url: `/users/${userId}`,
        headers: { Authorization: `Bearer ${authToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(200);
      expect(responseJson.status).toStrictEqual("success");
      expect(responseJson.data.user).toBeDefined();
    });

    it("should response 401 when access token not provided", async () => {
      // Arrange
      const userPayload = {
        username: "dicoding",
        password: "secret",
        fullname: "Dicoding Indonesia",
      };

      const server = await createServer(container);

      // Add account
      const user = await injection(server, addUserOption(userPayload));
      const userId = JSON.parse(user.payload)?.data?.addedUser.id;

      // Action
      const response = await server.inject({
        method: "GET",
        url: `/users/${userId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(401);
      expect(responseJson.error).toStrictEqual("Unauthorized");
    });

    it("should response 401 when access token invalid", async () => {
      // Arrange
      const userPayload = {
        username: "dicoding",
        password: "secret",
        fullname: "Dicoding Indonesia",
      };

      const server = await createServer(container);

      // Add account
      const user = await injection(server, addUserOption(userPayload));
      const userId = JSON.parse(user.payload)?.data?.addedUser.id;

      // Action
      const response = await server.inject({
        method: "GET",
        url: `/users/${userId}`,
        headers: { Authorization: "Bearer invalid_access_token" },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(401);
      expect(responseJson.error).toStrictEqual("Unauthorized");
    });

    it("should response 400 when user not found", async () => {
      // Arrange
      const accessToken = await container
        .getInstance(AuthenticationTokenManager.name)
        .createAccessToken({ id: "non_existent_user" });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "GET",
        url: "/users/non_existent_user",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(400);
      expect(responseJson.status).toStrictEqual("fail");
    });
  });
});

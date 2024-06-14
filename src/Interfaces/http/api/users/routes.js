const routes = (handler) => [
  {
    method: "POST",
    path: "/users",
    handler: handler.postUserHandler,
  },
  {
    method: "GET",
    path: "/users/me",
    handler: handler.getOwnProfileHandler,
    options: {
      auth: "forum_jwt",
    },
  },
  {
    method: "GET",
    path: "/users/{userId}",
    handler: handler.getUserByIdHandler,
    options: {
      auth: "forum_jwt",
    },
  },
];

module.exports = routes;

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
];

module.exports = routes;

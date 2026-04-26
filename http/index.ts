const server = Bun.serve({
  routes: {
    "/health": Response.json({
      status: "ok",
    }),
  },
  fetch(req) {
    return Response.json(
      {
        message: "Not found",
      },
      {
        status: 404,
      },
    );
  },
});

console.log(`Server running at ${server.url}`);

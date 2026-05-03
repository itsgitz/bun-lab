const server = Bun.serve({
  // `routes` requires Bun v1.2.3+
  routes: {
    // Static routes
    "/api/status": async (req) => {
      return Response.json({ status: "ok", message: "sehat anjay" });
    },

    // Dynamic routes
    "/users/:id": (req) => {
      //return new Response(`Hello User ${req.params.id}!`);
      return Response.json({
        message: `Hello user ${req.params.id || "no name"}`,
      });
    },

    // Per-HTTP method handlers
    "/api/posts": {
      GET: async (req) => {
        return Response.json({ message: "List posts!" });
      },
      POST: async (req) => {
        const body = await req.json();
        return Response.json({ created: true, ...body });
      },
    },
  },

  // (optional) fallback for unmatched routes:
  // Required if Bun's version < 1.2.3
  fetch(req) {
    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Server running at ${server.url}`);

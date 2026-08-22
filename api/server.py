from http.server import HTTPServer
import os

from query import handler

port = int(os.environ.get("PORT", "10000"))

server = HTTPServer(("0.0.0.0", port), handler)

print(f"VaaniRAG backend listening on port {port}")

server.serve_forever()
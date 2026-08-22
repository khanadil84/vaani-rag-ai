from http.server import HTTPServer
import json
import os

from query import handler as QueryHandler


class Handler(QueryHandler):

    def do_GET(self):
        path = self.path.split("?", 1)[0]

        # Health + metrics endpoints
        if path in (
            "/",
            "/health",
            "/api/health",
            "/metrics",
            "/api/metrics",
        ):
            body = {
                "status": "operational",
                "service": "VaaniRAG AI Backend",
                "version": "0.1.0",
                "deployment": "render",
                "queriesProcessed": 0,
                "transcriptions": 0,
                "avgLatencyMs": None,
                "sourcesIndexed": 0,
                "guardrailBlocks": 0,
                "uptimeSeconds": 0,
                "lastQuery": None,
            }

            data = json.dumps(body).encode("utf-8")

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            self.wfile.write(data)
            return

        self.send_error(404, "Not Found")


port = int(os.environ.get("PORT", "10000"))

server = HTTPServer(("0.0.0.0", port), Handler)

print(f"VaaniRAG backend listening on port {port}")

server.serve_forever()
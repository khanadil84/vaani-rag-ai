from http.server import HTTPServer
import json
import os

from query import handler as QueryHandler


class Handler(QueryHandler):

    def _send_json(self, body, status=200):
        data = json.dumps(body).encode("utf-8")

        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header(
            "Access-Control-Allow-Headers",
            "Content-Type, Authorization",
        )
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header(
            "Access-Control-Allow-Headers",
            "Content-Type, Authorization",
        )
        self.end_headers()

    def do_GET(self):
        path = self.path.split("?", 1)[0]

        if path in ("/", "/health", "/api/health"):
            self._send_json({
                "status": "operational",
                "service": "VaaniRAG AI Backend",
                "version": "0.1.0",
                "deployment": "render",
            })
            return

        if path in ("/metrics", "/api/metrics"):
            self._send_json({
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
            })
            return

        self.send_error(404, "Not Found")


port = int(os.environ.get("PORT", "10000"))

server = HTTPServer(("0.0.0.0", port), Handler)

print(f"VaaniRAG backend listening on port {port}")

server.serve_forever()
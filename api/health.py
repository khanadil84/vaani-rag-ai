from http.server import BaseHTTPRequestHandler
import json

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        body = {
            "status": "operational",
            "service": "VaaniRAG AI Backend",
            "version": "0.1.0",
            "deployment": "vercel-lightweight"
        }

        data = json.dumps(body).encode("utf-8")

        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

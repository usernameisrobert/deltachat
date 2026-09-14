#!/usr/bin/env python3
import json
import os
import re
import threading
import time
import urllib.error
import urllib.request
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse, unquote

ROOT = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(ROOT, "localdata")
CHATS_DIR = os.path.join(DATA_DIR, "chats")
PORT = int(os.environ.get("PORT", "8080"))
GROQ_KEY = os.environ.get("GROQ_KEY", "")
GROQ_MODEL = "openai/gpt-oss-120b"
GROQ_FALLBACK_MODEL = "openai/gpt-oss-20b"
GROQ_URL = "https://api.groq.com/openai/v1"
_groq_model = GROQ_MODEL
_groq_failures = 0
_groq_lock = threading.Lock()
LOCAL_USER = {"id": "ketchupdev-local", "username": "ketchupdev", "avatar_url": ""}
PLACEHOLDER_IMAGE = "/susnormal.png"

CONTENT_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".gif": "image/gif",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".ogg": "audio/ogg",
    ".oga": "audio/ogg",
    ".opus": "audio/ogg",
    ".wav": "audio/wav",
    ".mp3": "audio/mpeg",
    ".mp4": "video/mp4",
    ".ttf": "font/ttf",
    ".otf": "font/otf",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
}


def now_iso():
    return time.strftime("%Y-%m-%dT%H:%M:%S.000Z", time.gmtime())


def groq_request(path, body):
    if not GROQ_KEY:
        raise RuntimeError("GROQ_KEY is not set (run with GROQ_KEY=... )")
    req = urllib.request.Request(
        GROQ_URL + path,
        data=json.dumps(body).encode("utf-8"),
        headers={
            "Authorization": "Bearer " + GROQ_KEY,
            "Content-Type": "application/json",
            "User-Agent": "deltachat-server/1.0",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        detail = ""
        try:
            detail = (e.read().decode("utf-8", "replace") or "")[:500]
        except Exception:
            pass
        raise RuntimeError("Groq API returned HTTP %d: %s" % (e.code, detail))


def groq_chat_completions(messages, json_mode):
    global _groq_model, _groq_failures
    with _groq_lock:
        model = _groq_model
    body = {"model": model, "messages": messages}
    if json_mode:
        body["response_format"] = {"type": "json_object"}
    try:
        data = groq_request("/chat/completions", body)
    except Exception as e:
        if model == GROQ_MODEL:
            with _groq_lock:
                _groq_failures += 1
                if _groq_failures >= 3:
                    print("Switching model from %s to %s after %d consecutive failures: %s"
                          % (GROQ_MODEL, GROQ_FALLBACK_MODEL, _groq_failures, e))
                    _groq_model = GROQ_FALLBACK_MODEL
                    _groq_failures = 0
        raise
    with _groq_lock:
        _groq_failures = 0
    try:
        return data["choices"][0]["message"]["content"]
    except (KeyError, IndexError, TypeError):
        raise RuntimeError("Unexpected Groq response: " + json.dumps(data)[:500])


def load_chat(chat_id):
    path = os.path.join(CHATS_DIR, chat_id + ".json")
    if not os.path.exists(path):
        return None
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def list_chats():
    chats = []
    if os.path.isdir(CHATS_DIR):
        for name in os.listdir(CHATS_DIR):
            if name.endswith(".json"):
                path = os.path.join(CHATS_DIR, name)
                try:
                    with open(path, "r", encoding="utf-8") as f:
                        chats.append(json.load(f))
                except Exception:
                    continue
    chats.sort(key=lambda c: str(c.get("updated_at") or c.get("created_at") or ""), reverse=True)
    return chats


def save_chat(chat):
    chat_id = str(chat.get("id") or "")
    if not re.fullmatch(r"[A-Za-z0-9_-]{1,64}", chat_id):
        raise ValueError("Invalid chat id")
    os.makedirs(CHATS_DIR, exist_ok=True)
    existing = load_chat(chat_id) or {}
    record = dict(existing)
    record["id"] = chat_id
    record["owner_id"] = chat.get("owner_id") or LOCAL_USER["id"]
    record["username"] = LOCAL_USER["username"]
    record.setdefault("created_at", now_iso())
    if "title" in chat:
        record["title"] = chat["title"]
    if "transcript" in chat:
        record["transcript"] = chat["transcript"]
    record["updated_at"] = now_iso()
    with open(os.path.join(CHATS_DIR, chat_id + ".json"), "w", encoding="utf-8") as f:
        json.dump(record, f, ensure_ascii=False)
    return record


def delete_chat(chat_id):
    if not re.fullmatch(r"[A-Za-z0-9_-]{1,64}", str(chat_id)):
        raise ValueError("Invalid chat id")
    path = os.path.join(CHATS_DIR, chat_id + ".json")
    if os.path.exists(path):
        os.remove(path)


class Handler(SimpleHTTPRequestHandler):
    extensions_map = {**CONTENT_TYPES}

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.directory = ROOT

    def log_message(self, fmt, *args):
        print("[%s] %s" % (self.log_date_time_string(), fmt % args))

    def list_directory(self, path):
        self.send_error(404, "Not found")
        return None

    def _read_json(self):
        length = int(self.headers.get("Content-Length") or 0)
        if length <= 0:
            return {}
        raw = self.rfile.read(length)
        if not raw:
            return {}
        return json.loads(raw.decode("utf-8"))

    def _send_json(self, obj, status=200):
        body = json.dumps(obj).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _send_error_json(self, message, status=500):
        self._send_json({"error": message}, status)

    def do_GET(self):
        parsed = urlparse(self.path)
        route = parsed.path
        if route == "/api/me":
            self._send_json(LOCAL_USER)
            return
        if route == "/api/chats":
            self._send_json(list_chats())
            return
        super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)
        route = parsed.path
        if route == "/api/chat/completions":
            self._handle_chat_completions()
            return
        if route == "/api/imagegen":
            self._handle_imagegen()
            return
        if route == "/api/chats":
            self._handle_save_chat()
            return
        self.send_error(404, "Not found")

    def do_DELETE(self):
        parsed = urlparse(self.path)
        route = parsed.path
        prefix = "/api/chats/"
        if route.startswith(prefix):
            chat_id = unquote(route[len(prefix):])
            try:
                delete_chat(chat_id)
            except ValueError as e:
                self._send_error_json(str(e), 400)
                return
            self._send_json({"ok": True})
            return
        self.send_error(404, "Not found")

    def _handle_chat_completions(self):
        try:
            payload = self._read_json()
            messages = payload.get("messages")
            if not isinstance(messages, list) or not messages:
                raise ValueError("messages is required")
            content = groq_chat_completions(messages, bool(payload.get("json")))
            self._send_json({"content": content})
        except Exception as e:
            print("chat/completions error:", e)
            self._send_error_json(str(e))

    def _handle_imagegen(self):
        try:
            payload = self._read_json()
            prompt = payload.get("prompt")
            if not prompt:
                raise ValueError("prompt is required")
            self._send_json({"url": PLACEHOLDER_IMAGE})
        except Exception as e:
            print("imagegen error:", e)
            self._send_error_json(str(e))

    def _handle_save_chat(self):
        try:
            payload = self._read_json()
            if not payload.get("id"):
                raise ValueError("id is required")
            record = save_chat(payload)
            self._send_json(record)
        except ValueError as e:
            self._send_error_json(str(e), 400)
        except Exception as e:
            print("save chat error:", e)
            self._send_error_json(str(e))


# ---------- WSGI app (for gunicorn: `gunicorn server:app`) ----------


def _read_wsgi_json(environ):
    try:
        length = int(environ.get("CONTENT_LENGTH") or 0)
    except (TypeError, ValueError):
        length = 0
    if length <= 0:
        return {}
    raw = environ["wsgi.input"].read(length)
    if not raw:
        return {}
    return json.loads(raw.decode("utf-8"))


def _wsgi_json(start_response, obj, status=200):
    body = json.dumps(obj).encode("utf-8")
    start_response(
        "%d %s" % (status, "OK" if status == 200 else "Error"),
        [
            ("Content-Type", "application/json"),
            ("Content-Length", str(len(body))),
        ],
    )
    return [body]


def _wsgi_static(environ, start_response):
    path = unquote(environ.get("PATH_INFO") or "/")
    if path == "/":
        path = "/index.html"
    elif path.endswith("/"):
        return _wsgi_json(start_response, {"error": "Not found"}, 404)
    full = os.path.realpath(os.path.join(ROOT, path.lstrip("/")))
    if full != ROOT and not full.startswith(ROOT + os.sep):
        return _wsgi_json(start_response, {"error": "Not found"}, 404)
    if not os.path.isfile(full):
        return _wsgi_json(start_response, {"error": "Not found"}, 404)
    ext = os.path.splitext(full)[1].lower()
    ctype = CONTENT_TYPES.get(ext, "application/octet-stream")
    with open(full, "rb") as fh:
        body = fh.read()
    start_response(
        "200 OK",
        [
            ("Content-Type", ctype),
            ("Content-Length", str(len(body))),
        ],
    )
    if environ.get("REQUEST_METHOD") == "HEAD":
        return [b""]
    return [body]


def app(environ, start_response):
    path = unquote(environ.get("PATH_INFO") or "/")
    method = environ.get("REQUEST_METHOD", "GET")
    try:
        if path == "/api/me" and method == "GET":
            return _wsgi_json(start_response, LOCAL_USER)
        if path == "/api/chats":
            if method == "GET":
                return _wsgi_json(start_response, list_chats())
            if method == "POST":
                chat = _read_wsgi_json(environ)
                if not chat.get("id"):
                    return _wsgi_json(start_response, {"error": "id is required"}, 400)
                return _wsgi_json(start_response, save_chat(chat))
        if path.startswith("/api/chats/") and method == "DELETE":
            chat_id = unquote(path[len("/api/chats/"):])
            try:
                delete_chat(chat_id)
            except ValueError as e:
                return _wsgi_json(start_response, {"error": str(e)}, 400)
            return _wsgi_json(start_response, {"ok": True})
        if path == "/api/chat/completions" and method == "POST":
            payload = _read_wsgi_json(environ)
            messages = payload.get("messages")
            if not isinstance(messages, list) or not messages:
                return _wsgi_json(start_response, {"error": "messages is required"}, 400)
            content = groq_chat_completions(messages, bool(payload.get("json")))
            return _wsgi_json(start_response, {"content": content})
        if path == "/api/imagegen" and method == "POST":
            payload = _read_wsgi_json(environ)
            if not payload.get("prompt"):
                return _wsgi_json(start_response, {"error": "prompt is required"}, 400)
            return _wsgi_json(start_response, {"url": PLACEHOLDER_IMAGE})
        return _wsgi_static(environ, start_response)
    except ValueError as e:
        return _wsgi_json(start_response, {"error": str(e)}, 400)
    except Exception as e:
        print("app error:", e)
        return _wsgi_json(start_response, {"error": str(e)}, 500)


def main():
    os.makedirs(CHATS_DIR, exist_ok=True)
    if not GROQ_KEY:
        print("WARNING: GROQ_KEY is not set. Chat and image generation will fail.")
    httpd = ThreadingHTTPServer(("0.0.0.0", PORT), Handler)
    print("DELTACHAT running at http://localhost:%d" % PORT)
    print("Serving from:", ROOT)
    print("Chat data stored in:", CHATS_DIR)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down.")
        httpd.shutdown()


if __name__ == "__main__":
    main()
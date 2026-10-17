import subprocess
import platform
from backend.memory.memory import get_preference

OS = platform.system()


def open_app(app_name):
    try:
        if OS == "Darwin":
            subprocess.run(["open", "-a", app_name])
        elif OS == "Windows":
            subprocess.run(["start", app_name], shell=True)
    except Exception as e:
        print("❌ Error opening app:", e)


def search_web(query):
    url = f"https://www.google.com/search?q={query}"
    try:
        if OS == "Darwin":
            subprocess.run(["open", url])
        elif OS == "Windows":
            subprocess.run(f"start {url}", shell=True)
    except Exception as e:
        print("❌ Error searching:", e)


def execute_action(action, params):
    if action == "open_app":
        app = params.get("app")

        if app == "browser":
            app = get_preference("browser") or "Safari"

        open_app(app)

    elif action == "search":
        search_web(params.get("query", ""))

    else:
        print("❌ Unknown action:", action)
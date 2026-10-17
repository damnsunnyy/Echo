import json
import os

MEMORY_FILE = "memory.json"


def load_memory():
    if not os.path.exists(MEMORY_FILE):
        return {"preferences": {}, "facts": {}}

    with open(MEMORY_FILE, "r") as f:
        return json.load(f)


def save_memory(memory):
    with open(MEMORY_FILE, "w") as f:
        json.dump(memory, f, indent=2)


# 🔹 Preferences (browser, editor, etc.)
def set_preference(key, value):
    memory = load_memory()
    memory["preferences"][key] = value
    save_memory(memory)


def get_preference(key):
    memory = load_memory()
    return memory["preferences"].get(key)


# 🔹 Facts (name, personal info)
def remember_fact(key, value):
    memory = load_memory()
    memory["facts"][key] = value
    save_memory(memory)


def recall_fact(key):
    memory = load_memory()
    return memory["facts"].get(key)
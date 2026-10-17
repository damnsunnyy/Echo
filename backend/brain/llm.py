from backend.memory.memory import load_memory

SYSTEM_PROMPT = """
You are a personal AI assistant.

You:
- speak concisely
- adapt to user's style
- remember preferences
- act like a proactive assistant
- return JSON ONLY

Format:
{
  "type": "action" or "response",
  "action": "...",
  "parameters": {},
  "response": "..."
}
"""


def ask_llm(user_input):
    memory = load_memory()

    prompt = f"""
{SYSTEM_PROMPT}

User memory:
{memory}

User said:
{user_input}
"""

    import ollama

    response = ollama.chat(
        model="mistral",
        messages=[{"role": "user", "content": prompt}]
    )

    return response["message"]["content"]
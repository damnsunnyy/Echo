import sounddevice as sd
import numpy as np
import scipy.io.wavfile as wav
from faster_whisper import WhisperModel
import json
import requests
import re

from backend.brain.llm import ask_llm
from backend.actions.execute import execute_action
from backend.voice.speak import speak
from backend.memory.memory import set_preference, remember_fact

# 🔥 Logging function
def send_log(message):
    try:
        requests.post(
            "http://127.0.0.1:8000/log",
            params={"entry": message},
            timeout=0.5
        )
    except Exception as e:
        print("LOG ERROR:", e)


model = WhisperModel("small", compute_type="int8")

WAKE_WORDS = ["sana", "sanna","sona","sna","sza"]


def record_audio(duration=2, fs=16000):
    print("🎤 Listening...")
    audio = sd.rec(int(duration * fs), samplerate=fs, channels=1, dtype='int16')
    sd.wait()
    return audio, fs


def save_audio(audio, fs, filename="temp.wav"):
    wav.write(filename, fs, audio)


def transcribe(filename):
    segments, _ = model.transcribe(
        filename,
        language="en",
        beam_size=1
    )
    text = ""
    for segment in segments:
        text += segment.text
    return text.strip().lower()


if __name__ == "__main__":
    print("🟢 Assistant started. Say 'Sana ...'")

    while True:
        send_log("🔴 Listening...")
        audio, fs = record_audio(duration=4)
        save_audio(audio, fs, "temp.wav")

        text = transcribe("temp.wav")
        print("🧠 Heard:", text)
        send_log(f"Heard: {text}")

        if not any(w in text for w in WAKE_WORDS):
            continue

        command = text
        for w in WAKE_WORDS:
            command = command.replace(w, "")

        # 🔥 Clean noise (important)
        command = re.sub(r"[^a-zA-Z0-9 ]", "", command)
        command = command.strip()

        if not command:
            speak("hello sir,sure i will do it for you")
            continue

        print("⚡ Command:", command)
        send_log(f"Command: {command}")

        # 🧠 MEMORY LEARNING
        if "use" in command and "browser" in command:
            if "chrome" in command:
                set_preference("browser", "Google Chrome")
                speak("Got it, I will use Chrome as your browser")
                send_log("Memory updated: browser = Chrome")
                continue

            elif "safari" in command:
                set_preference("browser", "Safari")
                speak("Okay, Safari is now your browser")
                send_log("Memory updated: browser = Safari")
                continue

        if "my name is" in command:
            name = command.split("my name is")[-1].strip()
            remember_fact("name", name)
            speak(f"Nice to meet you {name}")
            send_log(f"Memory updated: name = {name}")
            continue

        # 🤖 AI
        try:
            llm_response = ask_llm(command)
            print("🤖 Raw:", llm_response)
        except Exception as e:
            print("❌ LLM error:", e)
            send_log("LLM connection error")
            continue

        try:
            data = json.loads(llm_response)
        except:
            print("❌ JSON parse failed")
            send_log("JSON parse failed")
            continue

        if data.get("type") == "action":
            execute_action(data.get("action"), data.get("parameters", {}))
            speak(data.get("response", "Done"))
            send_log(f"Action: {data.get('action')} | {data.get('response')}")

        else:
            speak(data.get("response", ""))
            send_log(f"Response: {data.get('response')}")
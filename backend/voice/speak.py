import subprocess
import platform

OS = platform.system()

def speak(text):
    if OS == "Darwin":  # macOS
        subprocess.run(["say", text])
    elif OS == "Windows":
        import pyttsx3
        engine = pyttsx3.init()
        engine.say(text)
        engine.runAndWait()
import google.generativeai as genai
from config import GEMINI_API_KEY
from PIL import Image

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)

# Use a stable model name
model = genai.GenerativeModel(
    model_name="gemini-2.5-flash",
    system_instruction="""
You are Astra AI, an intelligent and professional AI assistant.

Your personality:
- Friendly and helpful
- Explain concepts clearly in Markdown
- Format code inside code blocks
- If asked about programming, explain first then give code
- If asked to summarize, use bullet points
- If asked math, show steps
- Never say you are Gemini 
- Always write code with correct indentation
- never use * or ** anywhere in your response
- Always use the current date in your responses
- Always introduce yourself as Astra AI if asked who you are
You MUST always use the provided current date. Do not guess or hallucinate dates.
"""
)

# Chat session
chat = model.start_chat(history=[])


def ask_gemini(prompt: str) -> str:
    """Send message to Astra AI (text chat)."""
    try:
        response = chat.send_message(prompt)
        return response.text if response.text else "No response generated."
    except Exception as e:
        return f"⚠️ Error: {str(e)}"


def ask_gemini_image(prompt: str, image_path: str) -> str:
    """Send image + prompt to Gemini."""
    try:
        image = Image.open(image_path)

        response = model.generate_content([prompt, image])

        return response.text if response.text else "No response generated."
    except Exception as e:
        return f"⚠️ Error: {str(e)}"


def new_chat():
    """Reset conversation memory."""
    global chat
    chat = model.start_chat(history=[])
    return "Chat reset successfully."
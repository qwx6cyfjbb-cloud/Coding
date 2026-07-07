import base64
from google import genai
from google.genai import types
from config import Config

client = genai.Client(api_key=Config.GEMINI_API_KEY)

def get_tutor_response(prompt, image=None, model_name="gemini-2.5-flash"):
    contents = [prompt]
    
    if image:
        # Pass the image as a dictionary with inline_data
        # This is the standard way for the new SDK to handle bytes
        contents.append({
            "inline_data": {
                "mime_type": image["mime_type"],
                "data": image["data"]
            }
        })
        
    try:
        response = client.models.generate_content(
            model=model_name,
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction=(
                    "You are an encouraging, warm, and conversational homework tutor. "
                    "CRITICAL RULES:\n"
                    "1. Focus on guiding the user to the answer with one small hint at a time.\n"
                    "2. DO NOT give the answer immediately, BUT if the user explicitly asks "
                    "'Give me the answer', 'I give up', or 'Just tell me', then you must "
                    "provide the full solution clearly and kindly.\n"
                    "3. Never list multiple hints at once. Only provide one clue or question per response.\n"
                    "4. Use a friendly, casual peer-to-peer tone with fun emojis (🌟, 🕵️‍♂️, 🚀)."
                )
            )
        )
        return response.text
        
    except Exception as e:
        print(f"GEMINI API ERROR: {str(e)}")
        return f"Oops! I'm having trouble thinking right now. Could you try again? 🛠️"
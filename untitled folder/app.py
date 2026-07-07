import os
from flask import Flask, render_template, request, jsonify
from google import genai

app = Flask(__name__)

# Initialize the Gemini Client 
# It automatically picks up the GEMINI_API_KEY environment variable
client = genai.Client()

# In-memory chat history storage
# NOTE: This temporary list clears whenever your Flask server restarts!
chat_history = [
    # Optional default welcome message for the kid-friendly UI
    {
        "message": "", 
        "response": "👋 Hello explorer! Welcome to your AI Homework Buddy. Ask me any question, and let's learn together! 🚀"
    }
]

@app.route('/')
def home():
    """Renders the main dashboard user interface."""
    return render_template('index.html')

@app.route('/get_history', methods=['GET'])
def get_history():
    """Sends back the accumulated chat history to script.js on page load/refresh."""
    print(f"DEBUG Backend: Sending {len(chat_history)} items to frontend.")
    return jsonify(chat_history)

@app.route('/ask', methods=['POST'])
def ask():
    """Handles incoming user text and file uploads, requests Gemini, and saves to history."""
    user_message = request.form.get('message', '').strip()
    # No logic change needed, but ensure your default is valid:
    selected_model = request.form.get('model', 'gemini-3.5-flash')
    uploaded_file = request.files.get('file')

    # Safety check: reject completely empty payloads
    if not user_message and not uploaded_file:
        return jsonify({"error": "Empty message received"}), 400

    contents = []

    # Handle file/image attachment if provided
    if uploaded_file and uploaded_file.filename != '':
        try:
            file_bytes = uploaded_file.read()
            # Pass the file directly to contents as a dictionary bundle
            contents.append({
                "mime_type": uploaded_file.content_type,
                "data": file_bytes
            })
        except Exception as e:
            print(f"File handling error: {e}")
            return jsonify({"response": "Sorry, I had trouble reading that file! Please try again."}), 500

    # Append the text message to the generation contents
    if user_message:
        contents.append(user_message)

    try:
        # System instructions to keep the assistant structured and kid-friendly
        system_instruction = (
            "You are a helpful, encouraging, and clear AI Homework Tutor designed for kids. "
            "Explain concepts simply, use friendly formatting, incorporate emojis, and provide "
            "hints instead of just giving away direct answers immediately!"
        )

        # Call the official Google GenAI SDK
        response = client.models.generate_content(
            model=selected_model,
            contents=contents,
            config={
                "system_instruction": system_instruction,
                "temperature": 0.7
            }
        )
        
        ai_response = response.text if response.text else "I couldn't generate a response."

    except Exception as e:
        print(f"Gemini API Error: {e}")
        ai_response = "Oops! My thinking gears jammed. Could you ask that question one more time?"

    # --- CRITICAL FIX: Append to storage so it survives page refrshes ---
    chat_history.append({
        "message": user_message if user_message else "📷 Sent a file attachment",
        "response": ai_response
    })

    return jsonify({"response": ai_response})

# Add this near your other global lists (like chat_history)
schedule_items = [
    {"id": "task-1", "text": "Homework (wed)", "checked": True}
]

@app.route('/api/schedule', methods=['GET'])
def get_schedule():
    """Sends back the saved schedule items."""
    return jsonify(schedule_items)

@app.route('/api/schedule', methods=['POST'])
def save_schedule():
    """Saves the updated schedule list from the frontend."""
    global schedule_items
    data = request.get_json()
    if isinstance(data, list):
        schedule_items = data
        return jsonify({"status": "success"}), 200
    return jsonify({"status": "error", "message": "Invalid data format"}), 400

@app.route('/settings')
def settings():
    """Renders the settings configuration view panel."""
    return render_template('settings.html')

@app.route('/logout')
def logout():
    """Placeholder routing to clear session or return to login."""
    # If using flask login sessions, clear them here. For now, redirect back home.
    return "Logged out successfully! <a href='/'>Go back to Dashboard</a>"

if __name__ == '__main__':
    # Make sure you set your API key in your terminal before running:
    # export GEMINI_API_KEY="your-api-key-here"
    app.run(debug=True, port=5000)
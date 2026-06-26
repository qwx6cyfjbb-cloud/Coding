from flask import Flask, render_template, request, jsonify
from datetime import datetime
import os
import traceback
from werkzeug.utils import secure_filename

from utils.gemini import ask_gemini
from utils.file_handler import read_file

app = Flask(__name__)

# ----------------------------
# CONFIG
# ----------------------------
UPLOAD_FOLDER = "uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

uploaded_type = None
uploaded_content = ""
uploaded_filename = ""


# ----------------------------
# HOME
# ----------------------------
@app.route("/")
def home():
    return render_template("index.html")


# ----------------------------
# CHAT API
# ----------------------------
@app.route("/chat", methods=["POST"])
def chat():

    global uploaded_type, uploaded_content, uploaded_filename

    try:
        data = request.get_json()
        message = data.get("message", "")

        # REAL TIME DATE (IMPORTANT)
        current_date = datetime.now().strftime("%A, %d %B %Y")

        # COMMON RULE (FOR ALL PROMPTS)
        base_rule = f"""
IMPORTANT RULES:
- You MUST use the correct current date provided below.
- You MUST NOT guess or hallucinate any date.
- If unsure, always rely on the provided date.

Current real-world date: {current_date}
"""

        # ----------------------------
        # IMAGE FILE
        # ----------------------------
        if uploaded_content and uploaded_type == "image":

            prompt = f"""
You are Astra AI.

{base_rule}

User uploaded an image: {uploaded_filename}

Analyze it and answer the question.

User Question:
{message}
"""

        # ----------------------------
        # TEXT FILE
        # ----------------------------
        elif uploaded_content and uploaded_type == "text":

            prompt = f"""
You are Astra AI.

{base_rule}

File Name: {uploaded_filename}

File Content:
{uploaded_content}

User Question:
{message}
"""

        # ----------------------------
        # NO FILE
        # ----------------------------
        else:

            prompt = f"""
You are Astra AI.

{base_rule}

User message:
{message}
"""

        reply = ask_gemini(prompt)

        return jsonify({
            "success": True,
            "reply": reply
        })

    except Exception as e:
        traceback.print_exc()
        return jsonify({
            "success": False,
            "reply": f"Server Error: {str(e)}"
        }), 500


# ----------------------------
# UPLOAD API
# ----------------------------
@app.route("/upload", methods=["POST"])
def upload():

    global uploaded_type, uploaded_content, uploaded_filename

    try:
        if "file" not in request.files:
            return jsonify({"success": False, "message": "No file uploaded"}), 400

        file = request.files["file"]

        if file.filename == "":
            return jsonify({"success": False, "message": "Empty filename"}), 400

        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        file.save(filepath)

        uploaded_filename = filename
        ext = filename.rsplit(".", 1)[-1].lower()

        # TEXT FILES
        if ext in ["txt", "pdf", "docx", "csv", "xlsx"]:

            uploaded_type = "text"
            uploaded_content = read_file(filepath)

            return jsonify({
                "success": True,
                "type": "text",
                "filename": filename,
                "preview": uploaded_content[:1000]
            })

        # IMAGE FILES
        elif ext in ["png", "jpg", "jpeg", "webp"]:

            uploaded_type = "image"
            uploaded_content = filepath

            return jsonify({
                "success": True,
                "type": "image",
                "filename": filename,
                "preview": "Image uploaded successfully"
            })

        else:
            return jsonify({
                "success": False,
                "message": "Unsupported file type"
            }), 400

    except Exception as e:
        traceback.print_exc()
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# ----------------------------
# RUN
# ----------------------------
if __name__ == "__main__":
    app.run(
        debug=True,
        host="0.0.0.0",
        port=5000
    )
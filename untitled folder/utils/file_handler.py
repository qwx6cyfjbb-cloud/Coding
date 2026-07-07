import os
from werkzeug.utils import secure_filename

def process_uploaded_image(image_file, upload_folder):
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)
    filename = secure_filename(image_file.filename)
    filepath = os.path.join(upload_folder, filename)
    image_file.save(filepath)
    return f"[Image uploaded: {filename}]"
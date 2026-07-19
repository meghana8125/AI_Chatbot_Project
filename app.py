from flask import Flask, render_template, request, jsonify
from google import genai
from dotenv import load_dotenv
from PIL import Image
import os

# Load API key
load_dotenv("api.env")

API_KEY = os.getenv("GEMINI_API_KEY")

# Create Gemini client
client = genai.Client(api_key=API_KEY)

app = Flask(__name__)

UPLOAD_FOLDER = "static/uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/chat", methods=["POST"])
def chat():

    try:

        message = request.form.get("message", "")

        image = request.files.get("image")

        # ------------------------
        # IMAGE + TEXT
        # ------------------------

        if image and image.filename != "":

            image_path = os.path.join(
                UPLOAD_FOLDER,
                image.filename
            )

            image.save(image_path)

            img = Image.open(image_path)

            response = client.models.generate_content(

                model="gemini-2.5-flash",

                contents=[message, img]

            )

        # ------------------------
        # TEXT ONLY
        # ------------------------

        else:

            response = client.models.generate_content(

                model="gemini-2.5-flash",

                contents=message

            )

        return jsonify({

            "response": response.text

        })

    except Exception as e:

        return jsonify({

            "response": str(e)

        })


if __name__ == "__main__":
    app.run(debug=True)
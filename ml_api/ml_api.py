from flask import Flask, request, jsonify
# import joblib
# import numpy as np

app = Flask(__name__)

# Load trained model (train using repo script)
model = None


@app.route("/predict_water", methods=["POST"])
def predict_water():
    data = request.json
    # Instead of real ML prediction, return random result
    import random
    result = random.choice(["Safe", "Contaminated"])
    return jsonify({"result": result})


if __name__ == "__main__":
    app.run(port=5000)

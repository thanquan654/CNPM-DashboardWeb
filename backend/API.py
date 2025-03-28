import numpy as np
import pickle
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS

# Load mô hình đã huấn luyện
with open('./backend/xgb_model.pkl', 'rb') as f:
    saved_data = pickle.load(f)

xgb_model = saved_data['model']
ohe = saved_data['ohe']
scaler = saved_data['scaler']
label_encoders = saved_data['label_encoders']

app = Flask(__name__)
CORS(app)


def preprocess_input(input_data):
    categorical_features = ["Gender", "Category", "Season", "Payment Method", "Preferred Payment Method"]
    numerical_features = ["Age", "Review Rating", "Previous Purchases", "Frequency of Purchases",
                          "Purchase Amount (VND)"]

    # Điền giá trị trung bình cho thuộc tính số
    processed_numerical = {
        key: np.mean(input_data[key]) if key in input_data and isinstance(input_data[key], list) and len(
            input_data[key]) > 0 else 0 for key in numerical_features}

    # Xử lý dữ liệu phân loại (chọn giá trị đầu tiên nếu có nhiều giá trị)
    processed_categorical = {key: input_data[key][0] if key in input_data and isinstance(input_data[key], list) and len(
        input_data[key]) > 0 else "Unknown" for key in categorical_features}

    # Tạo DataFrame với một dòng dữ liệu duy nhất
    input_df = pd.DataFrame([{**processed_categorical, **processed_numerical}])

    # Mã hóa dữ liệu
    input_cat = ohe.transform(input_df[categorical_features])
    input_num = scaler.transform(input_df[numerical_features])
    X_input = np.hstack([input_cat, input_num])

    return X_input


def predict(input_data, top_n=5):
    X_input = preprocess_input(input_data)
    y_pred_probs = xgb_model.predict_proba(X_input)[0]  # Dự đoán xác suất

    # Đảm bảo y_pred_probs có đúng định dạng 1D
    y_pred_probs = np.array(y_pred_probs).flatten()

    top_indices = np.argsort(y_pred_probs)[-top_n:][::-1]
    predictions = [
        {
            "Item": label_encoders["Item Purchased"].inverse_transform([idx])[0],
            "Color": label_encoders["Color"].inverse_transform([idx])[0],
            "Probability": round(float(y_pred_probs[idx]), 4)
        }
        for idx in top_indices
    ]

    return {"predictions": predictions}


@app.route('/predict', methods=['POST'])
def predict_api():
    try:
        input_data = request.get_json()
        top_n = int(request.args.get('top_n', 5))
        result = predict(input_data, top_n)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 400


if __name__ == '__main__':
    app.run(debug=True)

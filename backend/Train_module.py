import pandas as pd
import numpy as np
import pickle
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler, LabelEncoder
from xgboost import XGBClassifier
from sklearn.multioutput import MultiOutputClassifier
from sklearn.metrics import accuracy_score, classification_report

# 1️⃣ Đọc dữ liệu
data = pd.read_csv('D:/final_4796_hanoi_hcm_updated.csv')

# 2️⃣ Giữ lại các thuộc tính cần thiết
features = ["Age", "Gender", "Category", "Season", "Review Rating",
            "Payment Method", "Preferred Payment Method", "Previous Purchases",
            "Frequency of Purchases", "Purchase Amount (VND)"]  # Đổi tên cột

targets = ["Item Purchased", "Color"]  # Dự đoán sản phẩm + màu

df = data[features + targets].dropna()

# Chuyển đổi cột 'Frequency of Purchases' thành số
purchase_freq_map = {"Weekly": 1, "Bi-Weekly": 2, "Monthly": 4, "Quarterly": 12, "Annually": 52}
df["Frequency of Purchases"] = df["Frequency of Purchases"].map(purchase_freq_map)

# Loại bỏ các giá trị không hợp lệ
df = df.dropna()

# 3️⃣ Chia tập dữ liệu thành Train - Validation - Test
train_data, test_data = train_test_split(df, test_size=0.3, random_state=42)
train_data, val_data = train_test_split(train_data, test_size=0.3, random_state=42)

# 4️⃣ Mã hóa biến phân loại
categorical_features = ["Gender", "Category", "Season", "Payment Method", "Preferred Payment Method"]
ohe = OneHotEncoder(handle_unknown='ignore', sparse_output=False)
ohe.fit(train_data[categorical_features])

X_train_cat = ohe.transform(train_data[categorical_features])
X_val_cat = ohe.transform(val_data[categorical_features])
X_test_cat = ohe.transform(test_data[categorical_features])

# 5️⃣ Chuẩn hóa dữ liệu số
numerical_features = ["Age", "Review Rating", "Previous Purchases",
                      "Frequency of Purchases", "Purchase Amount (VND)"]
scaler = StandardScaler()
scaler.fit(train_data[numerical_features])

X_train_num = scaler.transform(train_data[numerical_features])
X_val_num = scaler.transform(val_data[numerical_features])
X_test_num = scaler.transform(test_data[numerical_features])

# 6️⃣ Kết hợp lại thành dữ liệu đầu vào
X_train = np.hstack([X_train_cat, X_train_num])
X_val = np.hstack([X_val_cat, X_val_num])
X_test = np.hstack([X_test_cat, X_test_num])

y_train = train_data[targets]
y_val = val_data[targets]
y_test = test_data[targets]

# 7️⃣ Mã hóa nhãn đầu ra
label_encoders = {}
y_train_encoded = y_train.copy()
y_val_encoded = y_val.copy()
y_test_encoded = y_test.copy()

for col in targets:
    le = LabelEncoder()
    y_train_encoded[col] = le.fit_transform(y_train[col])
    y_val_encoded[col] = le.transform(y_val[col])
    y_test_encoded[col] = le.transform(y_test[col])
    label_encoders[col] = le

# 8️⃣ Huấn luyện mô hình XGBoost với MultiOutputClassifier (cải tiến chống overfitting)
xgb_base = XGBClassifier(
    n_estimators=80,  # Giảm số lượng cây để tránh overfitting
    max_depth=6,  # Giảm độ sâu của cây
    learning_rate=0.1,
    subsample=0.9,  # Tăng dropout trên tập dữ liệu train
    colsample_bytree=0.7,  # Giảm số lượng đặc trưng sử dụng cho mỗi cây
    reg_alpha=0.5,  # Thêm regularization L1
    reg_lambda=1.0,  # Thêm regularization L2
    booster='dart',  # Dùng DART để dropout các cây không quan trọng
    rate_drop=0.2,  # Xác suất dropout cây
    skip_drop=0.5,  # Xác suất bỏ qua cây khi train
    random_state=42
)
xgb_model = MultiOutputClassifier(xgb_base)
xgb_model.fit(X_train, y_train_encoded)

# 9️⃣ Lưu mô hình và các bộ mã hóa
to_save = {'model': xgb_model, 'ohe': ohe, 'scaler': scaler, 'label_encoders': label_encoders}
with open('xgb_model.pkl', 'wb') as f:
    pickle.dump(to_save, f)

# 🔟 Dự đoán và đánh giá mô hình
y_pred_encoded = xgb_model.predict(X_val)

for i, target in enumerate(targets):
    print(f"Accuracy for {target}: {accuracy_score(y_val_encoded[target], y_pred_encoded[:, i]):.4f}")
    print(classification_report(y_val_encoded[target], y_pred_encoded[:, i], zero_division=1))
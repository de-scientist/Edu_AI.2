import pandas as pd
import numpy as np
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, MinMaxScaler
import joblib

# Load dataset
data = pd.read_csv("training_data.csv")

# Convert categorical columns to numerical
user_encoder = LabelEncoder()
course_encoder = LabelEncoder()

data["User ID"] = user_encoder.fit_transform(data["User ID"])
data["Course ID"] = course_encoder.fit_transform(data["Course ID"])

# Save encoders for later use
joblib.dump(user_encoder, "user_encoder.pkl")
joblib.dump(course_encoder, "course_encoder.pkl")

# Normalize data
scaler = MinMaxScaler()
data[["Completed (%)", "Rating", "Skill Level"]] = scaler.fit_transform(data[["Completed (%)", "Rating", "Skill Level"]])
joblib.dump(scaler, "scaler.pkl")

# Features and labels
X = data[["User ID", "Completed (%)", "Rating", "Skill Level"]].values
y = tf.keras.utils.to_categorical(data["Course ID"], num_classes=len(data["Course ID"].unique()))

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Build Deep Learning Model
model = tf.keras.Sequential([
    tf.keras.layers.Dense(64, activation="relu", input_shape=(X_train.shape[1],)),
    tf.keras.layers.Dense(128, activation="relu"),
    tf.keras.layers.Dense(64, activation="relu"),
    tf.keras.layers.Dense(y_train.shape[1], activation="softmax")  # Output layer with softmax for multi-class classification
])

# Compile model
model.compile(optimizer="adam", loss="categorical_crossentropy", metrics=["accuracy"])

# Train model
model.fit(X_train, y_train, epochs=50, batch_size=8, validation_data=(X_test, y_test))

# Save model
model.save("course_recommender.h5")
print("✅ Deep Learning Model Trained & Saved Successfully!")

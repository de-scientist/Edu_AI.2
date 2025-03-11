import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import tensorflow as tf

# Load dataset
data = pd.read_csv("training_data.csv")

# Convert categorical columns to numerical
data["User ID"] = data["User ID"].astype("category").cat.codes
data["Course ID"] = data["Course ID"].astype("category").cat.codes

# Features and labels
X = data[["User ID", "Completed (%)", "Skill Level"]]
y = data["Course ID"]

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train AI model
model = RandomForestClassifier(n_estimators=100)
model.fit(X_train, y_train)

# Save model
import joblib
joblib.dump(model, "course_recommender.pkl")

print("Model training complete! 🎯")

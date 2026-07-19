# app/ml/config.py
import os

MODEL_PATH = os.getenv("MODEL_PATH", "../models/downloads/wafer_pretrained.keras")

# Order MUST match the order the model was trained/built with.
# This is the single source of truth for class order across the backend.
CLASS_NAMES = [
    "Center", "Donut", "Edge-Loc", "Edge-Ring", "Loc",
    "Random", "Scratch", "Near-full", "None",
]

INPUT_SIZE = (64, 64)  # (height, width) — must match model.input_shape

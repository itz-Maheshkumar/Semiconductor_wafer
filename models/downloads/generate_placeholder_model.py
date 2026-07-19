# generate_placeholder_model.py  (run once from backend/, or from models/ folder)
import tensorflow as tf
from tensorflow.keras import layers, models

# Must match what our inference wrapper expects: 64x64 grayscale input, 9-class output
INPUT_SHAPE = (64, 64, 1)
CLASS_NAMES = ["Center", "Donut", "Edge-Loc", "Edge-Ring", "Loc",
               "Random", "Scratch", "Near-full", "None"]

model = models.Sequential([
    layers.Input(shape=INPUT_SHAPE),
    layers.Conv2D(16, 3, activation="relu", padding="same"),
    layers.MaxPooling2D(),
    layers.Conv2D(32, 3, activation="relu", padding="same"),
    layers.MaxPooling2D(),
    layers.Conv2D(64, 3, activation="relu", padding="same", name="last_conv"),
    layers.GlobalAveragePooling2D(),
    layers.Dense(64, activation="relu"),
    layers.Dense(len(CLASS_NAMES), activation="softmax"),
])

model.compile(optimizer="adam", loss="categorical_crossentropy", metrics=["accuracy"])
model.summary()

model.save("wafer_pretrained.keras")
print("Saved wafer_pretrained.keras")
print("Input shape:", model.input_shape)
print("Output shape:", model.output_shape)
print("Classes (in output order):", CLASS_NAMES)
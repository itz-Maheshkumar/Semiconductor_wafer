# app/ml/inference.py
import numpy as np
import tensorflow as tf
from PIL import Image

from app.ml.config import MODEL_PATH, CLASS_NAMES, INPUT_SIZE

# Loaded once at import time — reused for every request, never reloaded per-call
print(f"Loading model from {MODEL_PATH} ...")
_model = tf.keras.models.load_model(MODEL_PATH)

_model(tf.zeros((1, *INPUT_SIZE, 1), dtype=tf.float32))

print("Model loaded. Input shape:", _model.input_shape, "Output shape:", _model.output_shape)


def preprocess_image(image: Image.Image) -> np.ndarray:
    """Convert an uploaded image into the exact shape/format the model expects."""
    image = image.convert("L")               # grayscale, 1 channel
    image = image.resize(INPUT_SIZE)          # match model's expected input size
    arr = np.array(image, dtype=np.float32) / 255.0   # normalize to 0-1
    arr = np.expand_dims(arr, axis=-1)        # (H, W) -> (H, W, 1)
    arr = np.expand_dims(arr, axis=0)         # (H, W, 1) -> (1, H, W, 1) batch of 1
    return arr


def predict(image: Image.Image) -> dict:
    """Run inference on a single image. Returns predicted class, confidence, and full distribution."""
    arr = preprocess_image(image)
    probs = _model.predict(arr, verbose=0)[0]  # shape (9,)

    predicted_index = int(np.argmax(probs))
    predicted_class = CLASS_NAMES[predicted_index]
    confidence = float(probs[predicted_index])

    class_probabilities = {
        CLASS_NAMES[i]: float(probs[i]) for i in range(len(CLASS_NAMES))
    }

    return {
        "predicted_class": predicted_class,
        "confidence": confidence,
        "class_probabilities": class_probabilities,
    }

# app/ml/inference.py  — add this below what you already have

# app/ml/inference.py

# Precompute once at import time: which layer index is "last_conv"
_layer_names = [layer.name for layer in _model.layers]
_last_conv_index = _layer_names.index("last_conv")


def generate_gradcam(image: Image.Image, target_class_index: int = None) -> Image.Image:
    arr = preprocess_image(image)
    input_tensor = tf.convert_to_tensor(arr, dtype=tf.float32)

    with tf.GradientTape() as tape:
        tape.watch(input_tensor)

        x = input_tensor
        conv_outputs = None
        for i, layer in enumerate(_model.layers):
            x = layer(x)
            if i == _last_conv_index:
                conv_outputs = x

        predictions = x  # final output after all layers

        if target_class_index is None:
            target_class_index = int(tf.argmax(predictions[0]))
        class_channel = predictions[:, target_class_index]

    grads = tape.gradient(class_channel, conv_outputs)
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

    conv_outputs = conv_outputs[0]
    heatmap = conv_outputs @ pooled_grads[..., tf.newaxis]
    heatmap = tf.squeeze(heatmap)
    heatmap = tf.maximum(heatmap, 0) / (tf.math.reduce_max(heatmap) + 1e-8)
    heatmap = heatmap.numpy()

    heatmap_img = Image.fromarray(np.uint8(255 * heatmap)).resize(INPUT_SIZE)
    heatmap_arr = np.array(heatmap_img)

    heatmap_rgb = np.zeros((*INPUT_SIZE, 3), dtype=np.uint8)
    heatmap_rgb[..., 0] = heatmap_arr

    base = image.convert("L").resize(INPUT_SIZE)
    base_rgb = np.stack([np.array(base)] * 3, axis=-1)

    overlay = (0.6 * base_rgb + 0.4 * heatmap_rgb).astype(np.uint8)
    return Image.fromarray(overlay)
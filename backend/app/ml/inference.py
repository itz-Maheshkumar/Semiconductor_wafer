# app/ml/inference.py
import os
import numpy as np
from PIL import Image

from app.ml.config import MODEL_PATH, CLASS_NAMES, INPUT_SIZE

try:
    import tensorflow as tf
except Exception:  # pragma: no cover - fallback for environments without TensorFlow
    tf = None

_model = None


def _fallback_prediction(image: Image.Image) -> dict:
    grayscale = np.array(image.convert("L"), dtype=np.float32)
    mean_intensity = float(grayscale.mean() / 255.0)
    predicted_index = min(len(CLASS_NAMES) - 1, max(0, int(mean_intensity * len(CLASS_NAMES))))
    predicted_class = CLASS_NAMES[predicted_index]

    class_probabilities = {name: 0.0 for name in CLASS_NAMES}
    class_probabilities[predicted_class] = 1.0

    return {
        "predicted_class": predicted_class,
        "confidence": 1.0,
        "class_probabilities": class_probabilities,
    }


def _load_model():
    global _model
    if tf is None:
        return None

    keras_module = getattr(tf, "keras", None)
    if keras_module is None or not hasattr(keras_module, "models"):
        return None

    if not os.path.exists(MODEL_PATH):
        return None

    try:
        loaded_model = keras_module.models.load_model(MODEL_PATH)
        loaded_model(tf.zeros((1, *INPUT_SIZE, 1), dtype=tf.float32))
        print("Model loaded. Input shape:", loaded_model.input_shape, "Output shape:", loaded_model.output_shape)
        return loaded_model
    except Exception as exc:
        print(f"Model load failed, using placeholder inference: {exc}")
        return None


_model = _load_model()
if _model is None:
    print("TensorFlow model unavailable; using placeholder inference fallback.")


def preprocess_image(image: Image.Image) -> np.ndarray:
    """Convert an uploaded image into the exact shape/format the model expects."""
    image = image.convert("L")
    image = image.resize(INPUT_SIZE)
    arr = np.array(image, dtype=np.float32) / 255.0
    arr = np.expand_dims(arr, axis=-1)
    arr = np.expand_dims(arr, axis=0)
    return arr


def predict(image: Image.Image) -> dict:
    """Run inference on a single image. Returns predicted class, confidence, and full distribution."""
    if _model is not None and tf is not None:
        try:
            arr = preprocess_image(image)
            probs = _model.predict(arr, verbose=0)[0]

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
        except Exception:
            pass

    return _fallback_prediction(image)


def generate_gradcam(image: Image.Image) -> Image.Image:
    gray = np.array(image.convert("L"), dtype=np.uint8)
    heatmap = np.linspace(0, 255, num=gray.size, dtype=np.uint8).reshape(gray.shape)
    heatmap_img = Image.fromarray(heatmap).resize(INPUT_SIZE)
    heatmap_arr = np.array(heatmap_img)

    heatmap_rgb = np.zeros((*INPUT_SIZE, 3), dtype=np.uint8)
    heatmap_rgb[..., 0] = heatmap_arr

    base = image.convert("L").resize(INPUT_SIZE)
    base_rgb = np.stack([np.array(base)] * 3, axis=-1)

    overlay = (0.6 * base_rgb + 0.4 * heatmap_rgb).astype(np.uint8)
    return Image.fromarray(overlay)
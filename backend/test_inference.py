# test_inference.py  (repo root or backend/, wherever imports resolve — see note below)
from PIL import Image
import numpy as np
from app.ml.inference import predict
from app.ml.inference import generate_gradcam

# Fake a wafer-map-like image: random noise, 64x64 grayscale
dummy = Image.fromarray((np.random.rand(64, 64) * 255).astype("uint8"), mode="L")

result = predict(dummy)
print(result)

heatmap_img = generate_gradcam(dummy)
heatmap_img.save("test_heatmap_output.png")
print("Saved test_heatmap_output.png — open it to check")


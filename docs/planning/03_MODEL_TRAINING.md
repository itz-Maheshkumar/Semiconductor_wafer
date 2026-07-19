# Model Fine-Tuning Guide (Phase 2)

**This is not Phase-1 (Monday) work.** Phase 1 uses an existing pretrained
model for inference only — see `01_PROJECT_OVERVIEW.md`. This doc is for
whoever picks up fine-tuning afterward, using Google Colab's free tier.

It is fine if this isn't started by Monday. It is also fine if results are
worse than the baseline pretrained model at first — the point of Phase 2 is
to have a repeatable pipeline, not a perfect model on day one.

## 1. Dataset

**WM-811K** wafer map dataset — ~811,000 real wafer maps from actual fabs,
labeled into 9 classes (`Center`, `Donut`, `Edge-Loc`, `Edge-Ring`, `Loc`,
`Random`, `Scratch`, `Near-full`, `None`).

- Available on Kaggle: search "WM-811K wafer map"
- Comes as a `.pkl` (pandas pickle) with wafer maps as 2D arrays (die
  states: 0 = blank/no die, 1 = pass, 2 = fail) and a label column
- Note: class distribution is heavily imbalanced (`None` and a few common
  patterns dominate) — must be handled (class weights or oversampling),
  otherwise the model will just learn to predict the majority class

Later, feedback data collected via the app (`POST /predictions/{id}/feedback`
corrections) can be exported from `app.db` and mixed in as an additional
fine-tuning set — but only once there's enough volume to matter (dozens of
corrections at minimum, ideally more).

## 2. Colab Setup

1. Go to https://colab.research.google.com, new notebook
2. Runtime → Change runtime type → **GPU** (T4 is available on free tier)
3. Mount Google Drive if storing the dataset there (recommended, avoids
   re-downloading each session):

```python
from google.colab import drive
drive.mount('/content/drive')
```

4. Get the dataset onto Colab. Easiest path — Kaggle API:

```python
!pip install kaggle
# Upload kaggle.json (from your Kaggle account settings) first
!mkdir -p ~/.kaggle && cp kaggle.json ~/.kaggle/
!chmod 600 ~/.kaggle/kaggle.json
!kaggle datasets download -d qingyi/wm811k-wafer-map
!unzip -q wm811k-wafer-map.zip -d /content/wm811k
```

(Search Kaggle for the exact current dataset slug if this one has moved —
there are a couple of WM-811K uploads on Kaggle.)

## 3. Preprocessing

```python
import pandas as pd
import numpy as np

df = pd.read_pickle('/content/wm811k/LSWMD.pkl')

# Keep only labeled rows (dataset includes many unlabeled wafers)
df = df[df['failureType'].apply(lambda x: len(x) > 0 if isinstance(x, (list, np.ndarray)) else False)]

# Resize each wafer map to a fixed size, e.g. 64x64, single channel
# Encode labels to the 9 classes listed above
```

Key steps to implement:
- Resize/pad each wafer map to a fixed shape (e.g. 64x64)
- Normalize die-state values (0/1/2) to a usable range for CNN input
- Encode labels to integers matching the class order used in
  `02_API_CONTRACT.md`'s `class_probabilities` object — **this order must
  match what the backend expects**, document it in the notebook
- Split: train / val / test (e.g. 80/10/10), stratified by class given the
  imbalance

## 4. Model

Start from a pretrained backbone rather than training from scratch — trains
faster and generalizes better with limited free-tier GPU time.

```python
import torch
import torch.nn as nn
from torchvision import models

model = models.resnet18(weights='IMAGENET1K_V1')
model.conv1 = nn.Conv2d(1, 64, kernel_size=7, stride=2, padding=3, bias=False)  # 1-channel input
model.fc = nn.Linear(model.fc.in_features, 9)  # 9 wafer defect classes
```

Fine-tuning strategy:
- Freeze early conv layers first, train only the final layers for a few
  epochs
- Unfreeze more layers and continue training at a lower learning rate
  ("gradual unfreezing") if time/GPU budget allows

Handle class imbalance with `class_weight` in the loss:

```python
criterion = nn.CrossEntropyLoss(weight=class_weights_tensor)
```

## 5. Training loop essentials

- Use `torch.cuda.amp` (mixed precision) to fit more into Colab's free GPU
  time/memory
- Save checkpoints periodically — Colab free tier disconnects sessions
  after inactivity/time limits, so don't lose hours of training
- Log per-class precision/recall each epoch, not just accuracy — for
  defect detection, missed defects (false negatives) matter more than raw
  accuracy

## 6. Evaluation

- Confusion matrix on the test set
- Per-class precision/recall/F1
- Grad-CAM sanity check on a handful of test images — does the heatmap
  actually highlight the defect region, or is the model cheating on some
  artifact?

## 7. Exporting the fine-tuned model

```python
torch.save(model.state_dict(), 'wafer_finetuned_v1.pt')
```

Download it from Colab and place it at:

```
models/finetuned/wafer_finetuned_v1.pt
```

in the repo (see `04_REPO_STRUCTURE.md`). Do **not** overwrite the
Phase-1 pretrained model file in `models/downloads/` directly — add the new
one alongside it, and only point the backend at it once it's been evaluated
and is actually better.

## 8. Swapping it into the backend

- Update the backend's model-loading config (a single constant/env var,
  e.g. `MODEL_PATH`) to point at the new `.pt` file
- Confirm the class index order in the notebook matches the order the
  backend expects in its softmax output mapping — **this is the most
  common bug** when swapping models, since a mismatched label order will
  silently produce confidently wrong predictions
- Restart the backend so it reloads the model at startup

## 9. Future iterations

- As `feedback` corrections accumulate via the app, periodically export
  them from `app.db` and mix into a fine-tuning round
- Track model versions (`wafer_finetuned_v1.pt`, `v2.pt`, ...) with a short
  changelog of what data/approach changed, so it's clear which model is
  running in production at any time

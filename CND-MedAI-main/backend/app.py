from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import torch
import torch.nn as nn
import torch.nn.functional as F
import pandas as pd
from torchvision import transforms, models
import timm
import os
from werkzeug.utils import secure_filename
import random

app = Flask(__name__)
CORS(app)
UPLOAD_FOLDER = "temp_uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# ---- Model definitions ----
class SimpleCNN(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv1 = nn.Conv2d(3, 32, 3, padding=1)
        self.pool = nn.MaxPool2d(2, 2)
        self.conv2 = nn.Conv2d(32, 64, 3, padding=1)
        self.fc1 = nn.Linear(64 * 56 * 56, 128)
        self.fc2 = nn.Linear(128, 1)
    def forward(self, x):
        x = self.pool(F.relu(self.conv1(x)))
        x = self.pool(F.relu(self.conv2(x)))
        x = x.view(-1, 64 * 56 * 56)
        x = F.relu(self.fc1(x))
        x = torch.sigmoid(self.fc2(x))
        return x

def load_second_model(device):
    model2 = models.resnet18(weights=None)
    model2.fc = nn.Sequential(
        nn.Dropout(0.5),
        nn.Linear(model2.fc.in_features, 1),
        nn.Sigmoid()
    )
    model2.load_state_dict(torch.load("./AI-Models/2nd_Pipeline.pth", map_location=device))
    model2.to(device)
    model2.eval()
    return model2

def load_third_model(device):
    model3 = timm.create_model('efficientnet_b0', pretrained=False, num_classes=5)
    model3.load_state_dict(torch.load("./AI-Models/3rd_Pipeline.pth", map_location=device))
    model3.to(device)
    model3.eval()
    return model3

model_stage1 = SimpleCNN().to(device)
model_stage1.load_state_dict(torch.load("./AI-Models/1st_Pipeline.pth", map_location=device))
model_stage1.eval()
model_stage2 = load_second_model(device)
model_stage3 = load_third_model(device)

class_names_stage2 = ['Cancer', 'Neurological Disorder']
class_names_stage3 = ["cancer_breast", "cancer_colon", "cancer_lung", "neuro_alzheimers", "neuro_ms"]

# Map subtype to final diagnostic model file
subtype_to_model = {
    "cancer_breast": "./AI-Models/Breast.pth",
    "cancer_colon": "./AI-Models/Colon.pth",
    "cancer_lung": "./AI-Models/Lung.pth",
    "neuro_alzheimers": "./AI-Models/Alzheimer.pth",
    "neuro_ms": "./AI-Models/MultipleSclerosis.pth",
}

def load_final_model(subtype, device):
    from torchvision import models
    """Load the disease-specific final diagnostic model"""
    model_path = subtype_to_model.get(subtype)
    if not model_path or not os.path.exists(model_path):
        print(f"Model path not found: {model_path}")
        return None
    
    try:
        checkpoint = torch.load(model_path, map_location=device)
        
        # Print checkpoint structure for debugging
        print(f"Loading {subtype} from {model_path}")
        if isinstance(checkpoint, dict):
            print(f"Checkpoint keys: {list(checkpoint.keys())[:10]}")
            # Check if it's wrapped in a 'model' or 'state_dict' key
            if 'state_dict' in checkpoint:
                checkpoint = checkpoint['state_dict']
            elif 'model' in checkpoint:
                checkpoint = checkpoint['model']
        
        # Load based on known architecture for each disease
        if subtype == "neuro_alzheimers":
            # EfficientNet-B3 with 4 classes (matches notebook training)
            # Classes: Mild Impairment, Moderate Impairment, No Impairment, Very Mild Impairment
            # Will be mapped to binary: No Impairment -> No Alzheimer, others -> Alzheimer
            try:
                model = timm.create_model('efficientnet_b3', pretrained=False, num_classes=4, drop_rate=0.6)
                model.load_state_dict(checkpoint, strict=False)
                print(f"Successfully loaded Alzheimer model with EfficientNet-B3, 4 classes")
                model.to(device)
                model.eval()
                return model
            except Exception as e:
                print(f"Error loading Alzheimer model: {e}")
                import traceback
                traceback.print_exc()
                return None
            
        elif subtype == "neuro_ms":
            try:
                # Load ConvNeXt Tiny with 2 output classes (Control=0, MS=1)
                # Matches training: convnext_tiny, pretrained=True, num_classes=2
                model = timm.create_model('convnext_tiny', pretrained=False, num_classes=2)
                # Load trained weights
                model.load_state_dict(checkpoint, strict=False)
                model.to(device)
                model.eval()
                print(f"Successfully loaded neuro_ms model with ConvNeXt Tiny")
                return model
            except Exception as e:
                print(f"Error loading neuro_ms model: {e}")
                import traceback
                traceback.print_exc()
                return None

        elif subtype == "cancer_lung":
            try:
                from torchvision import models
                # Load EfficientNet-B0 with 3 classes (Benign, Malignant, Normal)
                # Matches training: models.efficientnet_b0(pretrained=True) + 3 class head
                model = models.efficientnet_b0(pretrained=False)
                # Replace classifier for 3 classes
                num_features = model.classifier[1].in_features
                model.classifier[1] = nn.Linear(num_features, 3)

                # Load checkpoint weights
                model.load_state_dict(checkpoint, strict=False)

                model.to(device)
                model.eval()
                print(f"Successfully loaded Lung model with torchvision EfficientNet-B0, 3 classes")
                return model
            except Exception as e:
                print(f"Error loading lung cancer model: {e}")
                import traceback
                traceback.print_exc()
                return None

            
        elif subtype == "cancer_breast":
            # ResNet18 (confirmed from checkpoint - fc has 512 features)
            model = models.resnet18(weights=None)
            model.fc = nn.Linear(model.fc.in_features, 2)
            model.load_state_dict(checkpoint, strict=False)
            
        elif subtype == "cancer_colon":
            model = models.resnet18(weights=None)
            num_ftrs = model.fc.in_features
            model.fc = nn.Sequential(
                nn.Dropout(0.4),  # dropout to reduce overfitting
                nn.Linear(num_ftrs, 2)
            )

            # Load checkpoint weights non-strictly to allow partial loading
            model_state = model.state_dict()
            for k in checkpoint:
                if k in model_state and model_state[k].shape == checkpoint[k].shape:
                    model_state[k] = checkpoint[k]
            model.load_state_dict(model_state)

            model = model.to(device)
            model.eval()


            
        else:
            print(f"Unknown subtype: {subtype}")
            return None
        
        model.to(device)
        model.eval()
        print(f"Successfully loaded {subtype} model")
        return model
        
    except Exception as e:
        print(f"Error loading model for {subtype}: {e}")
        import traceback
        traceback.print_exc()
        return None

# Original transform for pipelines 1 & 2
transform_normal = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485,0.456,0.406], std=[0.229,0.224,0.225]),
])

# Transform matching your Colab for pipeline 3
transform_subtype = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    # include normalization if used in training
])

# Transform for MS model (matches notebook training: mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5])
transform_ms = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5]),
])

# Transform for Lung model (same as MS - matches CTlung notebook training)
transform_lung = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5]),
])

# Transform for Colon model (matches Colon_CT_Resnet18 notebook training)
transform_colon = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5]),
])

reference_csv_path = "./balanced_test_data.csv"
# Make CSV validation optional if reference file doesn't exist
if os.path.exists(reference_csv_path):
    reference_cols = list(pd.read_csv(reference_csv_path, nrows=1).columns)
    expected_col_count = len(reference_cols)
else:
    reference_cols = []
    expected_col_count = 0

def validate_image_file(temp_path):
    """
    Validate that the file is actually a valid image, not just by extension.
    Returns (success: bool, image: PIL.Image or None, error_message: str or None)
    """
    try:
        # Try to open and verify the image
        image = Image.open(temp_path)
        image.verify()  # Verify it's a valid image
        # Reopen after verify (verify() closes the file)
        image = Image.open(temp_path).convert("RGB")
        return True, image, None
    except Exception as e:
        return False, None, f"Invalid or corrupted image file: {str(e)}"

def is_valid_csv(file):
    if expected_col_count == 0:
        # No reference file, accept any CSV
        try:
            df = pd.read_csv(file, nrows=5)
            return True
        except:
            return False
    try:
        df = pd.read_csv(file, nrows=5)
        if len(df.columns) != expected_col_count:
            print("CSV column count mismatch:", len(df.columns), "expected:", expected_col_count)
            return False
        if set(df.columns) != set(reference_cols):
            print("CSV column headers mismatch.")
            return False
        return True
    except Exception as e:
        print("CSV validation error:", e)
        return False

class EpilepsyModel(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv1 = nn.Conv1d(in_channels=1, out_channels=64, kernel_size=3)
        self.pool1 = nn.MaxPool1d(kernel_size=2)
        self.conv2 = nn.Conv1d(in_channels=64, out_channels=128, kernel_size=3)
        self.pool2 = nn.MaxPool1d(kernel_size=2)
        self.lstm = nn.LSTM(input_size=128, hidden_size=64, batch_first=True)
        self.dropout = nn.Dropout(0.5)
        self.fc1 = nn.Linear(64, 64)
        self.fc2 = nn.Linear(64, 1)
    def forward(self, x):
        x = x.permute(0, 2, 1)
        x = self.conv1(x)
        x = torch.relu(x)
        x = self.pool1(x)
        x = self.conv2(x)
        x = torch.relu(x)
        x = self.pool2(x)
        x = x.permute(0, 2, 1)
        lstm_out, _ = self.lstm(x)
        out = lstm_out[:, -1, :]
        out = self.dropout(out)
        out = torch.relu(self.fc1(out))
        out = torch.sigmoid(self.fc2(out))
        return out.squeeze()

epilepsy_model = EpilepsyModel()
epilepsy_model.load_state_dict(torch.load("./AI-Models/Epilepsy.pth", map_location=device))
epilepsy_model.to(device)
epilepsy_model.eval()

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Backend is running"})

@app.route("/epilepsy", methods=["POST"])
def epilepsy_predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    file = request.files['file']
    filename = secure_filename(file.filename)
    temp_path = os.path.join(UPLOAD_FOLDER, filename)
    try:
        file.save(temp_path)
        df = pd.read_csv(temp_path)
        exclude_cols = ['y', 'original_row']
        exclude_cols = [col for col in exclude_cols if col in df.columns]
        numeric_features = df.select_dtypes(include='number').columns.difference(exclude_cols)
        features = df[numeric_features].values.astype('float32')
        tensor_feats = torch.tensor(features).unsqueeze(2).to(device)
        with torch.no_grad():
            outputs = epilepsy_model(tensor_feats)
        pred_probs = outputs.cpu().numpy()
        if pred_probs.ndim == 0:
            pred_probs = [pred_probs.item()]
        results = ["Seizure" if prob >= 0.0001 else "Non-seizure" for prob in pred_probs]
        os.remove(temp_path)
        if len(results) == 1:
            return jsonify({"result": results[0]})
        else:
            return jsonify({"results": results})
    except Exception as e:
        print("Epilepsy prediction error:", e)
        if os.path.exists(temp_path):
            os.remove(temp_path)
        return jsonify({"error": str(e)}), 500


@app.route("/predict", methods=["POST"])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    file = request.files['file']
    filename = secure_filename(file.filename)
    temp_path = os.path.join(UPLOAD_FOLDER, filename)
    try:
        file.save(temp_path)
        if filename.endswith(('.jpg','.jpeg','.png')):
            # Validate it's actually an image file
            is_valid, image, error_msg = validate_image_file(temp_path)
            if not is_valid:
                os.remove(temp_path)
                return jsonify({"error": error_msg}), 400
            
            tensor = transform_normal(image).unsqueeze(0).to(device)
            with torch.no_grad():
                output = model_stage1(tensor)
                confidence = round(float(output.item()), 3)
                pred = "Our Modality" if confidence < 0.5 else "Not Our Modality"
            os.remove(temp_path)
            
            print(f"Modality prediction: {pred}, confidence: {confidence}")
            
            # Return error flag if not our modality
            if pred == "Not Our Modality":
                return jsonify({"prediction": pred, "isNotOurModality": True}), 200
            return jsonify({"prediction": pred}), 200
        elif filename.endswith(".csv"):
            if is_valid_csv(temp_path):
                os.remove(temp_path)
                return jsonify({"prediction": "Our Modality"})
            else:
                os.remove(temp_path)
                return jsonify({"error": "Invalid CSV"})
        else:
            os.remove(temp_path)
            return jsonify({"error": "Unsupported file type"}), 400
    except Exception as e:
        print("Error in /predict:", e)
        if os.path.exists(temp_path):
            os.remove(temp_path)
        return jsonify({"error": str(e)}), 500

@app.route("/classify", methods=["POST"])
def classify():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    file = request.files['file']
    filename = secure_filename(file.filename)
    temp_path = os.path.join(UPLOAD_FOLDER, filename)
    try:
        file.save(temp_path)
        if filename.endswith(('.jpg','.jpeg','.png')):
            # Validate it's actually an image file
            is_valid, image, error_msg = validate_image_file(temp_path)
            if not is_valid:
                os.remove(temp_path)
                return jsonify({"error": error_msg}), 400
            
            tensor = transform_normal(image).unsqueeze(0).to(device)
            with torch.no_grad():
                prob = model_stage2(tensor).item()
                pred_idx = int(prob > 0.5)
                label = class_names_stage2[pred_idx]
            os.remove(temp_path)
            return jsonify({"classification": label})
        else:
            os.remove(temp_path)
            return jsonify({"error": "Only image files supported for classification"}), 400
    except Exception as e:
        print("Classification error:", e)
        if os.path.exists(temp_path):
            os.remove(temp_path)
        return jsonify({"error": str(e)}), 500

@app.route("/subtype", methods=["POST"])
def subtype():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    file = request.files['file']
    filename = secure_filename(file.filename)
    temp_path = os.path.join(UPLOAD_FOLDER, filename)
    try:
        file.save(temp_path)
        if filename.endswith(('.jpg','.jpeg','.png')):
            # Validate it's actually an image file
            is_valid, image, error_msg = validate_image_file(temp_path)
            if not is_valid:
                os.remove(temp_path)
                return jsonify({"error": error_msg}), 400
            
            tensor = transform_subtype(image).unsqueeze(0).to(device)
            with torch.no_grad():
                output = model_stage3(tensor)
                probabilities = torch.softmax(output, dim=1)[0]
                pred_idx = torch.argmax(probabilities).item()
                label = class_names_stage3[pred_idx]
            os.remove(temp_path)
            return jsonify({"subtype_prediction": label})
        else:
            os.remove(temp_path)
            return jsonify({"error": "Only image files supported for subtype classification"}), 400
    except Exception as e:
        print("Subtype error:", e)
        if os.path.exists(temp_path):
            os.remove(temp_path)
        return jsonify({"error": str(e)}), 500

@app.route("/diagnose", methods=["POST"])
def diagnose():
    """Final diagnostic stage - loads disease-specific model based on subtype"""
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    # Get the subtype from query parameter or form data
    subtype = request.form.get('subtype') or request.args.get('subtype')
    if not subtype:
        return jsonify({"error": "Subtype parameter required"}), 400
    
    if subtype not in subtype_to_model:
        return jsonify({"error": f"Unknown subtype: {subtype}"}), 400
    
    file = request.files['file']
    filename = secure_filename(file.filename)
    temp_path = os.path.join(UPLOAD_FOLDER, filename)
    
    try:
        file.save(temp_path)
        if filename.endswith(('.jpg','.jpeg','.png')):
            # Load disease-specific model
            final_model = load_final_model(subtype, device)
            if final_model is None:
                os.remove(temp_path)
                return jsonify({"error": f"Model not found for {subtype}"}), 500
            
            # Validate it's actually an image file
            is_valid, image, error_msg = validate_image_file(temp_path)
            if not is_valid:
                os.remove(temp_path)
                return jsonify({"error": error_msg}), 400
            
            # Use appropriate transform based on subtype
            if subtype == "neuro_ms":
                # MS model trained with mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5]
                tensor = transform_ms(image).unsqueeze(0).to(device)
            elif subtype == "cancer_lung":
                # Lung model trained with mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5]
                tensor = transform_lung(image).unsqueeze(0).to(device)
            elif subtype == "cancer_colon":
                # Colon model trained with mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5]
                tensor = transform_colon(image).unsqueeze(0).to(device)
            else:
                # Other models (Breast, Alzheimer) use ImageNet normalization
                tensor = transform_normal(image).unsqueeze(0).to(device)
            
            with torch.no_grad():
                output = final_model(tensor)
                # Handle different output formats based on subtype
                probabilities = torch.softmax(output, dim=1)[0]
                pred_class = torch.argmax(probabilities).item()
                
                # Define class labels for each subtype matching training
                if subtype == "cancer_lung":
                    lung_labels = ["Benign", "Malignant", "Normal"]
                    diagnosis = lung_labels[pred_class]
                elif subtype == "cancer_breast":
                    breast_labels = ["Benign", "Malignant"]
                    diagnosis = breast_labels[pred_class]
                elif subtype == "cancer_colon":
                    colon_labels = ["Non_Cancer", "Cancer"]
                    diagnosis = colon_labels[pred_class]
                elif subtype == "neuro_alzheimers":
                    # 4-class model: map to binary
                    # Classes: 0=Mild Impairment, 1=Moderate Impairment, 2=No Impairment, 3=Very Mild Impairment
                    # Binary mapping: class 2 -> No Alzheimer, others -> Alzheimer
                    binary_map = {0: 1, 1: 1, 2: 0, 3: 1}  # 0=No Alzheimer, 1=Alzheimer
                    pred_binary = binary_map[pred_class]
                    binary_labels = ["No Alzheimer", "Alzheimer"]
                    diagnosis = binary_labels[pred_binary]
                elif subtype == "neuro_ms":
                    # Binary: Control vs MS
                    ms_labels = ["Control", "MS"]
                    diagnosis = ms_labels[pred_class]
                else:
                    # Fallback binary handling
                    diagnosis = "Disease Detected" if pred_class == 1 else "Normal"

            
            os.remove(temp_path)
            return jsonify({
                "diagnosis": diagnosis,
                "subtype": subtype
            })
        else:
            os.remove(temp_path)
            return jsonify({"error": "Only image files supported for diagnosis"}), 400
    except Exception as e:
        print("Diagnosis error:", e)
        if os.path.exists(temp_path):
            os.remove(temp_path)
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5001)

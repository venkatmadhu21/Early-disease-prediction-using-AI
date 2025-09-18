# AI-Based Medical Assistant for Early Disease Detection

A web-based AI assistant to support doctors in early disease detection using medical imaging.

## Overview

This project is a web platform designed to assist doctors by providing early detection of diseases using AI. Users can upload CT scans, MRI scans, EEG signals, or histopathology images, and the system classifies the input using a **Mixture of Experts (MoE)** deep learning architecture.

The platform ensures:

- Input validation for supported medical formats.
- Classification of the input into **Cancer** or **Neurological Diseases**.
- Fine-grained disease detection through expert CNN models.

## Features

- **User Authentication**: Sign up / Sign in with personal details.
- **Data Upload**: Upload CT, MRI, EEG, or histopathology images.
- **Input Validation**: Detects invalid input formats and displays an error message.
- **Mixture of Experts (MoE)**:
  - Binary classification to validate input type.
  - Classification of disease category: Cancer or Neurological.
  - Expert CNN models for specific diseases:
    - **Cancer**: Lung, Breast, Colon.
    - **Neurological Diseases**: Multiple Sclerosis, Epilepsy, Alzheimer’s.
- **Dashboard**:
  - User profile management.
  - Upload history tracking.
  - Website description and info.

## Architecture

1. **Input Layer**: Accepts CT, MRI, EEG, or histopathology images.
2. **Gating Network**: Binary classifier to detect valid medical inputs.
3. **Intermediate Classifier**: Classifies input as Cancer or Neurological.
4. **Expert Models**: Disease-specific CNN models for fine-grained detection.
5. **Output Layer**: Returns the detected disease (e.g., Lung Cancer, Multiple Sclerosis).

## Usage

1. Sign up or log in.
2. Upload a medical image or signal.
3. System validates the input:
   - **Invalid** → Error message displayed.
   - **Valid** → Moves to disease classification.
4. View results in the dashboard along with upload history.

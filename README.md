# Automated Matrix Diagonalizer

A web application that checks if an n×n matrix (n ≤ 5) is diagonalizable. If so, it computes matrices **P** and **D** such that **P⁻¹AP = D**.

## Features

- Dynamic matrix input (2×2 to 5×5)
- Computes eigenvectors (P) and eigenvalues (D)
- Verifies P⁻¹AP = D
- Handles non-diagonalizable matrices

---

## Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Run the Server

```bash
python app.py
```

### 3. Open in Browser

Go to: **http://127.0.0.1:5000**

---

## For VS Code Live Share Collaborators

If you're joining via Live Share, the host needs to share port 5000:

### Host Instructions:
1. Open the **Live Share** panel (bottom left)
2. Under **Shared Servers**, click **"Share server..."**
3. Enter port: `5000`
4. Select **Public** access

### Guest Instructions:
1. Look for **Shared Servers** in the Live Share panel
2. Click on the shared port 5000
3. It will open in your browser automatically

> **Note:** If you want to run locally, install dependencies first with `pip install -r requirements.txt`

---

## Tech Stack

- **Backend:** Python Flask + NumPy
- **Frontend:** HTML, CSS, JavaScript

---

## Project Structure

```
linalg/
├── app.py                 # Flask server & diagonalization logic
├── requirements.txt       # Python dependencies
├── templates/
│   └── index.html         # UI template
└── static/
    ├── index.css          # Styling
    └── script.js          # Frontend logic
```

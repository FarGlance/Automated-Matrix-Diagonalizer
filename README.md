# Automated Matrix Diagonalizer

<div align="center">

<img src="diagonalizer.png" alt ="Matrix Diagonalizer" width = "120">

A web application that checks if an n×n matrix (n ≤ 5) is diagonalizable. If so, it computes matrices **P** and **D** such that **P⁻¹AP = D**.

</div>
---

## Table of Contents

- [Automated Matrix Diagonalizer](#automated-matrix-diagonalizer)
  - [Table of Contents](#table-of-contents)
  - [About](#about)
    - [The Power of Diagonalization](#the-power-of-diagonalization)
    - [Try It Here](#try-it-here)
  - [Features](#features)
    - [Eigen-Solver Engine](#eigen-solver-engine)
    - [User Experience](#user-experience)
    - [Mathematical Breakdown](#mathematical-breakdown)
  - [Demo](#demo)
    - [Diagonalization Example ($A = PDP^{-1}$)](#diagonalization-example)

  - [User Instructions](#user-instructions)
    - [Basic Workflow](#basic-workflow)
    - [Example Walkthrough](#example-walkthrough)
  - [Operations](#operations)
    - [Eigenvalues and Eigenvectors](#eigenvalues-and-eigenvectors)
  - [Technologies Used](#technologies-used)
    - [Frontend Framework](#frontend-framework)
    - [Backend](#backend)
    - [Host](#host)
  - [Project Structure](#project-structure)
  - [License](#license)
  - [Acknowledgments](#acknowledgments)
    
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


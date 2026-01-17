from flask import Flask, render_template, request, jsonify
import numpy as np

app = Flask(__name__)


def is_diagonalizable(matrix):
    """
    Check if a matrix is diagonalizable.
    A matrix is diagonalizable if for each eigenvalue, 
    the geometric multiplicity equals the algebraic multiplicity.
    """
    n = matrix.shape[0]
    
    # Handle zero matrix or near-zero matrix
    if np.allclose(matrix, 0):
        # Zero matrix is diagonalizable (D=0, P=I)
        return True, np.zeros(n), np.eye(n)
    
    eigenvalues, eigenvectors = np.linalg.eig(matrix)
    
    # Check if eigenvector matrix is singular (not invertible)
    # This indicates the matrix is NOT diagonalizable
    try:
        det = np.linalg.det(eigenvectors)
        if np.abs(det) < 1e-10:
            return False, eigenvalues, eigenvectors
    except:
        return False, eigenvalues, eigenvectors
    
    # Additional check: verify P^(-1)AP = D actually works
    try:
        P_inv = np.linalg.inv(eigenvectors)
        D = np.diag(eigenvalues)
        result = P_inv @ matrix @ eigenvectors
        if not np.allclose(result, D, atol=1e-8):
            return False, eigenvalues, eigenvectors
    except np.linalg.LinAlgError:
        return False, eigenvalues, eigenvectors
    
    return True, eigenvalues, eigenvectors


def diagonalize_matrix(matrix):
    """
    Diagonalize a matrix A to find P and D such that P^(-1)AP = D.
    Returns P (eigenvector matrix), D (diagonal eigenvalue matrix), and P_inv.
    """
    is_diag, eigenvalues, eigenvectors = is_diagonalizable(matrix)
    
    if not is_diag:
        return None, None, None, False
    
    # P is the matrix of eigenvectors (columns are eigenvectors)
    P = eigenvectors
    
    # D is the diagonal matrix of eigenvalues
    D = np.diag(eigenvalues)
    
    # Compute P inverse
    try:
        P_inv = np.linalg.inv(P)
    except np.linalg.LinAlgError:
        return None, None, None, False
    
    return P, D, P_inv, True


def format_matrix(matrix, precision=4):
    """Format a numpy matrix as a list of lists for JSON serialization."""
    # Handle complex numbers
    if np.iscomplexobj(matrix):
        result = []
        for row in matrix:
            formatted_row = []
            for val in row:
                if np.abs(val.imag) < 1e-10:
                    formatted_row.append(round(val.real, precision))
                else:
                    real_part = round(val.real, precision)
                    imag_part = round(val.imag, precision)
                    if imag_part >= 0:
                        formatted_row.append(f"{real_part}+{imag_part}i")
                    else:
                        formatted_row.append(f"{real_part}{imag_part}i")
            result.append(formatted_row)
        return result
    else:
        return [[round(float(val), precision) for val in row] for row in matrix]


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/diagonalize', methods=['POST'])
def api_diagonalize():
    try:
        data = request.get_json()
        matrix_data = data.get('matrix', [])
        
        if not matrix_data:
            return jsonify({'error': 'No matrix provided'}), 400
        
        # Convert to numpy array
        matrix = np.array(matrix_data, dtype=float)
        
        # Validate square matrix
        if matrix.shape[0] != matrix.shape[1]:
            return jsonify({'error': 'Matrix must be square'}), 400
        
        # Validate size
        n = matrix.shape[0]
        if n < 1 or n > 5:
            return jsonify({'error': 'Matrix size must be between 1 and 5'}), 400
        
        # Perform diagonalization
        P, D, P_inv, is_diag = diagonalize_matrix(matrix)
        
        if not is_diag:
            return jsonify({
                'diagonalizable': False,
                'message': 'The matrix is NOT diagonalizable. It does not have n linearly independent eigenvectors.'
            })
        
        # Verify: P^(-1) * A * P should equal D
        verification = P_inv @ matrix @ P
        
        return jsonify({
            'diagonalizable': True,
            'P': format_matrix(P),
            'D': format_matrix(D),
            'P_inv': format_matrix(P_inv),
            'verification': format_matrix(verification),
            'original': format_matrix(matrix)
        })
        
    except np.linalg.LinAlgError as e:
        return jsonify({'error': f'Linear algebra error: {str(e)}'}), 400
    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

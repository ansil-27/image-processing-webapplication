import cv2
import numpy as np
from flask import Flask, render_template, request, jsonify
import base64

# Initialize Flask application
app = Flask(__name__, static_url_path='/static', static_folder='static')

# Function to read an image file
def read_img(filename):
    img = cv2.imread(filename)
    return img

# Function for edge detection using adaptive thresholding
def edge_detection(img, line_wdt, blur):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    grayBlur = cv2.medianBlur(gray, blur)
    edges = cv2.adaptiveThreshold(grayBlur, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, line_wdt, blur)
    return edges

# Function for color quantization using K-means clustering
def color_quantisation(img, k):
    data = np.float32(img).reshape((-1, 3))
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 20, 0.001)
    ret, label, center = cv2.kmeans(data, k, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS)
    center = np.uint8(center)
    result = center[label.flatten()]
    result = result.reshape(img.shape)
    return result

# Function to convert an image into a sketch-like representation
def sketch_conversion(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    inverted_gray = 255 - gray
    blurred = cv2.GaussianBlur(inverted_gray, (21, 21), 0)
    inverted_blurred = 255 - blurred
    sketch = cv2.divide(gray, inverted_blurred, scale=256.0)
    return sketch

# Function to create a mosaic effect on the image
def create_mosaic(image, scale_factor):
    small_image = cv2.resize(image, None, fx=1/scale_factor, fy=1/scale_factor)
    mosaic_image = cv2.resize(small_image, (image.shape[1], image.shape[0]), interpolation=cv2.INTER_NEAREST)
    return mosaic_image

# Route handler for the home page
# Route handler for the home page
@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        file = request.files['file']
        if file:
            # Read the uploaded image file
            img = cv2.imdecode(np.fromstring(file.read(), np.uint8), cv2.IMREAD_COLOR)

            # Parameters for image processing
            line_wdt = 9
            blur_value = 7
            total_colors = 8  # Update to include more colors for the cartoon image

            # Image processing pipeline
            edges = edge_detection(img, line_wdt, blur_value)
            img_cartoon = color_quantisation(img, total_colors)
            blurred = cv2.bilateralFilter(img_cartoon, d=7, sigmaColor=200, sigmaSpace=200)
            cartoon = cv2.bitwise_and(blurred, blurred, mask=edges)

            sketch = sketch_conversion(img)
            mosaic = create_mosaic(img, scale_factor=9)

            # Encode processed and original images as base64 strings
            _, original_bytes = cv2.imencode('.png', img)
            original_str = base64.b64encode(original_bytes).decode('utf-8')

            _, sketch_bytes = cv2.imencode('.png', sketch)
            sketch_str = base64.b64encode(sketch_bytes).decode('utf-8')

            _, mosaic_bytes = cv2.imencode('.png', mosaic)
            mosaic_str = base64.b64encode(mosaic_bytes).decode('utf-8')

            _, cartoon_bytes = cv2.imencode('.png', cartoon)
            cartoon_str = base64.b64encode(cartoon_bytes).decode('utf-8')

            # Return original and processed images as JSON response
            return jsonify({
                'original': original_str,
                'sketch': sketch_str,
                'mosaic': mosaic_str,
                'cartoon': cartoon_str
            })

    # Render the HTML template
    return render_template('index.html')


if __name__ == '__main__':
    # Run the Flask application in debug mode
    app.run(debug=True)

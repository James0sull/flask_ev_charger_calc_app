# Start with an official lightweight Python image
FROM python:3.11-slim

# Set the folder inside the container where our code will live
WORKDIR /ev_app

# Copy requirements and install them inside the container
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all local files to the container
COPY . .

# Expose the port Flask runs on
EXPOSE 5000

# Tell Docker to run our app.py when the container starts
CMD ["python", "ev_app.py"]
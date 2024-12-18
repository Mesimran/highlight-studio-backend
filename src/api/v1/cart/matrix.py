import matplotlib.pyplot as plt # type: ignore
import seaborn as sns # type: ignore
import numpy as np

# Sample metrics for demonstration (replace with your actual values)
epochs = np.arange(1, 11)  # Example epochs from 1 to 10
accuracy = [0.70, 0.72, 0.75, 0.77, 0.80, 0.82, 0.84, 0.86, 0.87, 0.88]  # Example accuracy values
precision = [0.68, 0.70, 0.73, 0.74, 0.76, 0.78, 0.80, 0.82, 0.84, 0.85]  # Example precision values
recall = [0.72, 0.74, 0.76, 0.78, 0.80, 0.81, 0.83, 0.85, 0.86, 0.87]  # Example recall values
f1_score = [0.70, 0.71, 0.74, 0.75, 0.78, 0.80, 0.81, 0.83, 0.85, 0.86]  # Example F1-score values

# Create the plot
plt.figure(figsize=(10, 6))

# Plot accuracy
plt.plot(epochs, accuracy, label='Accuracy', color='blue', marker='o')

# Plot precision
plt.plot(epochs, precision, label='Precision', color='green', marker='o')

# Plot recall
plt.plot(epochs, recall, label='Recall', color='orange', marker='o')

# Plot F1-score
plt.plot(epochs, f1_score, label='F1-Score', color='red', marker='o')

# Add labels and title
plt.title('Model Performance Metrics Over Epochs', fontsize=14)
plt.xlabel('Epochs', fontsize=12)
plt.ylabel('Metric Value', fontsize=12)

# Show a legend
plt.legend()

# Display the grid
plt.grid(True)

# Show the plot
plt.show()

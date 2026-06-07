import os
import joblib
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score
from .data_preprocessor import DataPreprocessor

class ModelTrainer:
    def __init__(self):
        # Determine paths relative to this file
        current_dir = os.path.dirname(__file__)
        self.save_dir = os.path.abspath(os.path.join(current_dir, '..', 'saved_model'))
        
        if not os.path.exists(self.save_dir):
            os.makedirs(self.save_dir)

    def train(self):
        preprocessor = DataPreprocessor()
        X, y, le = preprocessor.extract_and_engineer()

        if X is None or len(X) < 10:
            print("Not enough data to train the model. Seed the database first.")
            return None

        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        # Train model
        model = DecisionTreeClassifier(max_depth=5, random_state=42)
        model.fit(X_train, y_train)

        # Evaluate
        y_pred = model.predict(X_test)
        acc = accuracy_score(y_test, y_pred)

        # Save model and encoder
        joblib.dump(model, os.path.join(self.save_dir, 'decision_tree.joblib'))
        joblib.dump(le, os.path.join(self.save_dir, 'label_encoder.joblib'))

        return acc

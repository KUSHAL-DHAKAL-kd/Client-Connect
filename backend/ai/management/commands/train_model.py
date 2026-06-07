from django.core.management.base import BaseCommand
from core.model_trainer import ModelTrainer

class Command(BaseCommand):
    help = 'Trains the Decision Tree AI model for slot suggestions'

    def handle(self, *args, **options):
        self.stdout.write("Training model...")
        trainer = ModelTrainer()
        accuracy = trainer.train()

        if accuracy is not None:
            self.stdout.write(self.style.SUCCESS(f"Successfully trained model with accuracy: {accuracy*100:.2f}%"))
            self.stdout.write(self.style.SUCCESS("Model saved to ai/saved_model/"))
        else:
            self.stdout.write(self.style.ERROR("Model training failed."))

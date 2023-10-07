import csv
from authentication.models import User, CompanyGsheetSource
from io import StringIO
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient

# Create your tests here.
class WorkforceViewTest(TestCase):
    def setUp(self) -> None:
        self.user = User.objects.create(
            first_name="Jean-Luc",
            last_name="LaPoutre",
            email="jeanluc@lapoutre.com",
            password="jeanluc",
            username="jeanluc",
            type="business"
        )

        self.company_data = CompanyGsheetSource.objects.create(
            company_name=self.user.email.strip(".com").split("@")[1],
        )

        self.client = APIClient()        

    def create_mock_csv(self, data):
        # Create a StringIO object to simulate a file-like object
        csv_file = StringIO()
        
        # Create a CSV writer
        csv_writer = csv.writer(csv_file)
        
        # Write the data to the CSV file
        for row in data:
            csv_writer.writerow(row)
        
        # Move the file cursor to the beginning of the StringIO object
        csv_file.seek(0)
        
        return csv_file        
    
    def test_post(self) -> None:
        """
        Tests the view happy path.
        """
        # Arrange
        self.client.login(email=self.user.email,
                          password=self.user.password)
        
        url = reverse("workforce", kwargs={"user_id": self.user.id})

        mock_data = [
            ["Employee Name", "Job Title", "Seniority Level", "Department", "Country", "City", "Gender", "Marital Status", "Date of Birth", "Nationality", "Start Date", "Termination Date", "Reason for Termination", "Yearly Base Salary"],
            ["John Doe", "Engineer", "Senior", "Engineering", "USA", "New York", "Male", "Married", "1980-01-01", "American", "2023-01-01", "", "", "75000"]
        ]

        # Create a mock CSV file
        # TODO: figure out authentication. It's still being a pain...
        mock_csv = self.create_mock_csv(mock_data)

        # Actgi
        response = self.client.post(url, {'file': mock_csv})

        mock_csv.close()

        # Assert
        self.assertEqual(response.status_code, 201)

    def test_bad_header_formatting(self) -> None:
        """
        Tests that wrong headers on the CSV raise a validation error
        """
        # Arrange
        # Arrange
        self.client.login(email=self.user.email,
                          password=self.user.password)
        
        url = reverse("workforce", kwargs={"user_id": self.user.id})

        mock_data = [
            ["Job Title", "Seniority Level", "Department", "Country", "City", "Gender", "Marital Status", "Date of Birth", "Nationality", "Start Date", "Termination Date", "Reason for Termination", "Yearly Base Salary"],
            ["John Doe", "Engineer", "Senior", "Engineering", "USA", "New York", "Male", "Married", "1980-01-01", "American", "2023-01-01", "", "", "75000"]
        ]

        # Create a mock CSV file
        # TODO: figure out authentication. It's still being a pain...
        mock_csv = self.create_mock_csv(mock_data)

        # Act
        response = self.client.post(url, {'file': mock_csv})

        mock_csv.close()

        # Assert
        self.assertEqual(response.status_code, 400)

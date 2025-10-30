import java.util.Scanner;

public class UniversityEnrollment {

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        try {
            // Read inputs
            String name = sc.nextLine();
            int age = Integer.parseInt(sc.nextLine());
            int courseId = Integer.parseInt(sc.nextLine());
            int credits = Integer.parseInt(sc.nextLine());

            // Validate age
            if (age < 17 || age > 30) {
                System.out.println("Invalid age. Must be between 17 and 30.");
                return;
            }

            // Validate course ID
            if (courseId < 10000 || courseId > 99999) {
                System.out.println("Invalid Course ID. Must be a 5-digit number.");
                return;
            }

            // Validate credits
            if (credits < 1 || credits > 30) {
                System.out.println("Invalid number of credits. Must be between 1 and 30.");
                return;
            }

            // If all validations pass
            System.out.println("Enrollment Successful!");
            System.out.println("Student Name: " + name);
            System.out.println("Age: " + age);
            System.out.println("Course ID: " + courseId);
            System.out.println("Credits: " + credits);

        } catch (NumberFormatException e) {
            System.out.println("Invalid input. Please enter numeric values for age, course ID, and credits.");
        }
    }
}

const readline = require("readline");

// Interface for CLI input/output
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Array to store employees
let employees = [];

// Function to show menu
function showMenu() {
  console.log(`
==============================
   Employee Management System
==============================
1. Add Employee
2. View All Employees
3. Update Employee
4. Delete Employee
5. Search Employee
6. Exit
`);
  rl.question("Enter your choice: ", handleMenu);
}

// Handle menu choices
function handleMenu(choice) {
  switch (choice.trim()) {
    case "1":
      addEmployee();
      break;
    case "2":
      viewEmployees();
      break;
    case "3":
      updateEmployee();
      break;
    case "4":
      deleteEmployee();
      break;
    case "5":
      searchEmployee();
      break;
    case "6":
      console.log("Exiting... 👋");
      rl.close();
      break;
    default:
      console.log("Invalid choice! Try again.");
      showMenu();
  }
}

// Add new employee
function addEmployee() {
  rl.question("Enter employee name: ", name => {
    rl.question("Enter employee ID: ", id => {
      rl.question("Enter employee role: ", role => {
        const emp = { name, id, role };
        employees.push(emp);
        console.log("✅ Employee added successfully!");
        showMenu();
      });
    });
  });
}

// View all employees
function viewEmployees() {
  if (employees.length === 0) {
    console.log("⚠️ No employees found!");
  } else {
    console.table(employees);
  }
  showMenu();
}

// Update employee details
function updateEmployee() {
  rl.question("Enter Employee ID to update: ", id => {
    const emp = employees.find(e => e.id === id);
    if (!emp) {
      console.log("⚠️ Employee not found!");
      return showMenu();
    }

    rl.question("Enter new name (leave blank to keep same): ", name => {
      rl.question("Enter new role (leave blank to keep same): ", role => {
        if (name) emp.name = name;
        if (role) emp.role = role;
        console.log("✅ Employee updated successfully!");
        showMenu();
      });
    });
  });
}

// Delete employee
function deleteEmployee() {
  rl.question("Enter Employee ID to delete: ", id => {
    const index = employees.findIndex(e => e.id === id);
    if (index === -1) {
      console.log("⚠️ Employee not found!");
    } else {
      employees.splice(index, 1);
      console.log("🗑️ Employee deleted successfully!");
    }
    showMenu();
  });
}

// Search employee by ID
function searchEmployee() {
  rl.question("Enter Employee ID to search: ", id => {
    const emp = employees.find(e => e.id === id);
    if (!emp) {
      console.log("⚠️ Employee not found!");
    } else {
      console.table([emp]);
    }
    showMenu();
  });
}

// Start the system
showMenu();

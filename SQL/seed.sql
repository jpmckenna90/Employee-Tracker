USE employeetracker_db;
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("James", "McKenna", 1, 2);
INSERT INTO role (title, salary, department_id)
VALUES ("Web Developer", "60000", 3);
INSERT INTO department(title)
VALUES ("Development");

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Steve", "Smith", 1, 2);
INSERT INTO role (title, salary, department_id)
VALUES ("Web Developer", "60000", 3);
INSERT INTO department(title)
VALUES ("Development");

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Mike", "Miller", 2, 3);
INSERT INTO role (title, salary, department_id)
VALUES ("HR Manager", "80000", 4);
INSERT INTO department(title)
VALUES ("Human Resources");
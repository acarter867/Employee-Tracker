INSERT INTO DEPARTMENT(name)
VALUES
('Information Technology'),
('Accounting'),
('Marketing'),
('Human Resources');

INSERT INTO role(title, salary, department_id)
VALUES
('Software Engineer', 100000, 1),
('IT Manager', 100000, 1),
('Accountant', 150000, 2),
('Accounting Manager', 150000, 2),
('Marketing Specialist', 150000, 3),
('Marketing Manager', 150000, 3),
('Customer Representative', 150000, 4),
('HR Manager', 150000, 4);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES
('Alec', 'Carter', 1, NULL),
('Kyle', 'Carter', 2, 1),
('Bob', 'Doll', 3, NULL),
('Doofus', 'Roofus', 4, 3),
('Peter', 'Griffin0', 5, null),
('Lois', 'Griffin', 6, 5);
import { MongoClient } from 'mongodb';

import { AgeGroup, EmployeeType } from '../cpf/cpf.types';

const MONGO_URI = 'mongodb://localhost:27017/cpf-local';

const CPF_RATES_DATA = [
  {
    ageGroup: AgeGroup.LESS_THAN_55,
    employeeType: EmployeeType.CITIZEN,
    employeeRate: 20,
    employerRate: 17,
    effectiveDate: new Date('2024-01-01'),
    wageFloor: 50,
    wageCeiling: 7400, // Jan 2025
  },
  {
    ageGroup: AgeGroup.FROM_55_TO_60,
    employeeType: EmployeeType.CITIZEN,
    employeeRate: 17,
    employerRate: 15.5,
    effectiveDate: new Date('2024-01-01'),
    wageFloor: 50,
    wageCeiling: 7400,
  },
  {
    ageGroup: AgeGroup.FROM_60_TO_65,
    employeeType: EmployeeType.CITIZEN,
    employeeRate: 11.5,
    employerRate: 12,
    effectiveDate: new Date('2024-01-01'),
    wageFloor: 50,
    wageCeiling: 7400,
  },
  {
    ageGroup: AgeGroup.ABOVE_65,
    employeeType: EmployeeType.CITIZEN,
    employeeRate: 7.5,
    employerRate: 5,
    effectiveDate: new Date('2024-01-01'),
    wageFloor: 50,
    wageCeiling: 7400,
  },
];

const EMPLOYEE_DATA = [
  {
    _id: '1001',
    name: 'John Doe',
    employeeType: EmployeeType.CITIZEN,
    dateOfBirth: new Date('1990-01-15'),
    basicSalary: 5000,
    department: 'Engineering',
    joinDate: new Date('2023-01-01'),
  },
  {
    _id: '1002',
    name: 'Jane Smith',
    employeeType: EmployeeType.PR_FIRST_YEAR,
    dateOfBirth: new Date('1985-06-20'),
    basicSalary: 7000,
    department: 'Finance',
    joinDate: new Date('2023-03-01'),
  },
];

async function seedDatabase() {
  try {
    const client = await MongoClient.connect(MONGO_URI);
    const db = client.db();

    // Clear existing data
    await db.collection('cpf-rates').deleteMany({});
    await db.collection('employees').deleteMany({});

    // Insert new data
    await db.collection('cpf-rates').insertMany(CPF_RATES_DATA);
    // @ts-ignore
    await db.collection('employees').insertMany(EMPLOYEE_DATA);

    console.log('Database seeded successfully!');
    await client.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();

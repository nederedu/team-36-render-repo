const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function main() {
    await db.users.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            username: 'admin',
            email: 'admin@example.org',
            password: 'password',
            first_name: null,
            last_name: null,
        },
    });

    await db.patients.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            mrn: '1',
            first_name: 'ZZZ_Test',
            last_name: 'ZZZ_Patient',
            date_of_birth: new Date('1991-1-1'),
            street: 'Main St',
            house_number: '123',
            city: 'Madison',
            state: 'WI',
            zip: '53703',
            country: 'United States',
            phone: '123-456-7890',
            email: 'ZZZ_test@example.org',
        },
    });

    await db.observations.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            patient_id: 1,
            type: 'Blood Pressure',
            value: '120/80',
            unit: 'bp',
            observation_instant: new Date('1991-1-1'),
        },
    });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
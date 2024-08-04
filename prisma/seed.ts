import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

const initialPosts = [
  { name: 'Post 1' },
  { name: 'Post 2' },
  { name: 'Post 3' },
];

const seed = async () => {
  // Clean up before the seeding (optional)
  await prisma.post.deleteMany();

  // Seed initial posts
  for (const post of initialPosts) {
    await prisma.post.create({
      data: post,
    });
  }

  // Create some Person records
  const person1 = await prisma.person.create({
    data: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
    },
  });

  const person2 = await prisma.person.create({
    data: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
    },
  });

  // Create some Device records
  const device1 = await prisma.device.create({
    data: {
      manufacturer: 'Apple',
      model: 'iPhone 13',
      osVersion: 'iOS 15',
      imei: '123456789012345',
      accessories: 'Charger, Earphones',
      conditionNotes: 'Good condition',
      dateAddedToInventory: new Date('2023-01-01'),
      dateCheckedOut: new Date('2023-02-01'),
      dateReturned: new Date('2023-03-01'),
      previousOwnerId: person1.id,
      personId: person2.id,
    },
  });

  const device2 = await prisma.device.create({
    data: {
      manufacturer: 'Samsung',
      model: 'Galaxy S21',
      osVersion: 'Android 11',
      imei: '987654321098765',
      accessories: 'Charger, Earphones',
      conditionNotes: 'Excellent condition',
      dateAddedToInventory: new Date('2023-02-01'),
      dateCheckedOut: null,
      dateReturned: null,
      previousOwnerId: person2.id,
      personId: null,
    },
  });

  console.log({ person1, person2, device1, device2 });
};

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
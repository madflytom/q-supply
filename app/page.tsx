import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

const createPost = async (formData: FormData) => {
  'use server';

  const name = formData.get('name') as string;

  await prisma.post.create({
    data: {
      name,
    },
  });

  revalidatePath('/');
};

const deletePost = async (id: string) => {
  'use server';

  await prisma.post.delete({
    where: {
      id,
    },
  });

  revalidatePath('/');
};

const createDevice = async (formData: FormData) => {
  'use server';

  const manufacturer = formData.get('manufacturer') as string;
  const model = formData.get('model') as string;
  const osVersion = formData.get('osVersion') as string;
  const imei = formData.get('imei') as string;
  const accessories = formData.get('accessories') as string;
  const conditionNotes = formData.get('conditionNotes') as string;
  const personId = formData.get('personId') as string;
  const previousOwnerId = formData.get('previousOwnerId') as string;

  // Validate personId and previousOwnerId
  const person = personId ? await prisma.person.findUnique({ where: { id: personId } }) : null;
  const previousOwner = previousOwnerId ? await prisma.person.findUnique({ where: { id: previousOwnerId } }) : null;

  if (personId && !person) {
    throw new Error(`Person with ID ${personId} does not exist.`);
  }

  if (previousOwnerId && !previousOwner) {
    throw new Error(`Previous owner with ID ${previousOwnerId} does not exist.`);
  }

  await prisma.device.create({
    data: {
      manufacturer,
      model,
      osVersion,
      imei,
      accessories,
      conditionNotes,
      personId: personId || null,
      previousOwnerId: previousOwnerId || null,
      dateAddedToInventory: new Date(),
    },
  });

  revalidatePath('/');
};

const deleteDevice = async (id: string) => {
  'use server';

  await prisma.device.delete({
    where: {
      id,
    },
  });

  revalidatePath('/');
};

const createPerson = async (formData: FormData) => {
  'use server';

  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;

  await prisma.person.create({
    data: {
      firstName,
      lastName,
      email,
    },
  });

  revalidatePath('/');
};

const Home = async () => {
  const posts = await prisma.post.findMany();
  const devices = await prisma.device.findMany();
  const people = await prisma.person.findMany();

  return (
    <div className="p-4 flex flex-col gap-y-8">
      <section className="p-4 border rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Posts</h2>
        <form action={createPost} className="flex flex-col gap-y-2 mb-4">
          <input type="text" name="name" placeholder="Name" className="p-2 border rounded" />
          <button type="submit" className="p-2 bg-blue-500 text-white rounded">Create Post</button>
        </form>
        <ul className="flex flex-col gap-y-2">
          {posts.map((post) => (
            <li key={post.id} className="flex items-center justify-between p-2 border rounded">
              <div>{post.name}</div>
              <div className="flex items-center gap-x-2">
                <Link href={`/posts/${post.id}`}>
                  <button className="p-2 bg-green-500 text-white rounded">Go To</button>
                </Link>
                <Link href={`/posts/${post.id}/edit`}>
                  <button className="p-2 bg-yellow-500 text-white rounded">Edit</button>
                </Link>
                <form action={deletePost.bind(null, post.id)}>
                  <button type="submit" className="p-2 bg-red-500 text-white rounded">Delete</button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="p-4 border rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Devices</h2>
        <form action={createDevice} className="flex flex-col gap-y-2 mb-4">
          <input type="text" name="manufacturer" placeholder="Manufacturer" className="p-2 border rounded" />
          <input type="text" name="model" placeholder="Model" className="p-2 border rounded" />
          <input type="text" name="osVersion" placeholder="OS Version" className="p-2 border rounded" />
          <input type="text" name="imei" placeholder="IMEI" className="p-2 border rounded" />
          <input type="text" name="accessories" placeholder="Accessories" className="p-2 border rounded" />
          <input type="text" name="conditionNotes" placeholder="Condition Notes" className="p-2 border rounded" />
          <select name="personId" className="p-2 border rounded">
            <option value="">Select Person</option>
            {people.map((person) => (
              <option key={person.id} value={person.id}>
                {person.firstName} {person.lastName}
              </option>
            ))}
          </select>
          <select name="previousOwnerId" className="p-2 border rounded">
            <option value="">Select Previous Owner</option>
            {people.map((person) => (
              <option key={person.id} value={person.id}>
                {person.firstName} {person.lastName}
              </option>
            ))}
          </select>
          <button type="submit" className="p-2 bg-blue-500 text-white rounded">Create Device</button>
        </form>
        <ul className="flex flex-col gap-y-2">
          {devices.map((device) => (
            <li key={device.id} className="flex items-center justify-between p-2 border rounded">
              <div>{device.model}</div>
              <div className="flex items-center gap-x-2">
                <Link href={`/devices/${device.id}`}>
                  <button className="p-2 bg-green-500 text-white rounded">Go To</button>
                </Link>
                <Link href={`/devices/${device.id}/edit`}>
                  <button className="p-2 bg-yellow-500 text-white rounded">Edit</button>
                </Link>
                <form action={deleteDevice.bind(null, device.id)}>
                  <button type="submit" className="p-2 bg-red-500 text-white rounded">Delete</button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="p-4 border rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">People</h2>
        <form action={createPerson} className="flex flex-col gap-y-2 mb-4">
          <input type="text" name="firstName" placeholder="First Name" className="p-2 border rounded" />
          <input type="text" name="lastName" placeholder="Last Name" className="p-2 border rounded" />
          <input type="email" name="email" placeholder="Email" className="p-2 border rounded" />
          <button type="submit" className="p-2 bg-blue-500 text-white rounded">Create Person</button>
        </form>
        <ul className="flex flex-col gap-y-2">
          {people.map((person) => (
            <li key={person.id} className="flex items-center justify-between p-2 border rounded">
              <div>{person.firstName} {person.lastName}</div>
              <div className="flex items-center gap-x-2">
                <Link href={`/persons/${person.id}`}>
                  <button className="p-2 bg-green-500 text-white rounded">Go To</button>
                </Link>
                <Link href={`/persons/${person.id}/edit`}>
                  <button className="p-2 bg-yellow-500 text-white rounded">Edit</button>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Home;
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

  await prisma.device.create({
    data: {
      manufacturer,
      model,
      osVersion,
      imei,
      accessories,
      conditionNotes,
      personId,
      previousOwnerId,
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

const Home = async () => {
  const posts = await prisma.post.findMany();
  const devices = await prisma.device.findMany();
  const people = await prisma.person.findMany();

  return (
    <div className="p-4 flex flex-col gap-y-4">
      <h2>Posts</h2>

      <form action={createPost} className="flex flex-col gap-y-2">
        <input type="text" name="name" placeholder="Name" />
        <button type="submit">Create</button>
      </form>

      <ul className="flex flex-col gap-y-2">
        {posts.map((post) => (
          <li key={post.id} className="flex items-center gap-x-4">
            <div>{post.name}</div>
            <div className="flex items-center">
              <Link href={`/posts/${post.id}`}>Go To</Link> |{' '}
              <Link href={`/posts/${post.id}/edit`}>Edit</Link>
              <form action={deletePost.bind(null, post.id)}>
                <button type="submit">Delete</button>
              </form>
            </div>
          </li>
        ))}
      </ul>

      <h2>Devices</h2>

      <form action={createDevice} className="flex flex-col gap-y-2">
        <input type="text" name="manufacturer" placeholder="Manufacturer" />
        <input type="text" name="model" placeholder="Model" />
        <input type="text" name="osVersion" placeholder="OS Version" />
        <input type="text" name="imei" placeholder="IMEI" />
        <input type="text" name="accessories" placeholder="Accessories" />
        <input type="text" name="conditionNotes" placeholder="Condition Notes" />
        
        <select name="personId">
          <option value="">Select Person</option>
          {people.map((person) => (
            <option key={person.id} value={person.id}>
              {person.firstName} {person.lastName}
            </option>
          ))}
        </select>

        <select name="previousOwnerId">
          <option value="">Select Previous Owner</option>
          {people.map((person) => (
            <option key={person.id} value={person.id}>
              {person.firstName} {person.lastName}
            </option>
          ))}
        </select>

        <button type="submit">Create</button>
      </form>

      <ul className="flex flex-col gap-y-2">
        {devices.map((device) => (
          <li key={device.id} className="flex items-center gap-x-4">
            <div>{device.model}</div>
            <div className="flex items-center">
              <Link href={`/devices/${device.id}`}>Go To</Link> |{' '}
              <Link href={`/devices/${device.id}/edit`}>Edit</Link>
              <form action={deleteDevice.bind(null, device.id)}>
                <button type="submit">Delete</button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
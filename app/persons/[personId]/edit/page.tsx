import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

const updatePerson = async (formData: FormData) => {
  'use server';

  const id = formData.get('id') as string;
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;

  await prisma.person.update({
    where: {
      id,
    },
    data: {
      firstName,
      lastName,
      email,
    },
  });

  revalidatePath('/');
  redirect('/');
};

type EditPersonPageProps = {
  params: {
    personId: string;
  };
};

const EditPersonPage = async ({ params }: EditPersonPageProps) => {
  const person = await prisma.person.findUnique({
    where: {
      id: params.personId,
    },
    include: {
      devices: true,
      previousDevices: true,
    },
  });

  if (!person) {
    return notFound();
  }

  return (
    <div className="p-4 flex flex-col gap-y-8">
      <section className="p-4 border rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Edit Person</h2>
        <form action={updatePerson} className="flex flex-col gap-y-2">
          <input type="hidden" name="id" value={person.id} />
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            defaultValue={person.firstName}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            defaultValue={person.lastName}
            className="p-2 border rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            defaultValue={person.email}
            className="p-2 border rounded"
          />
          <button type="submit" className="p-2 bg-blue-500 text-white rounded">Update</button>
        </form>
      </section>
    </div>
  );
};

export default EditPersonPage;
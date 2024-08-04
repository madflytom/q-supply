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
    <form action={updatePerson}>
      <input type="hidden" name="id" value={person.id} />
      <input
        type="text"
        name="firstName"
        placeholder="First Name"
        defaultValue={person.firstName}
      />
      <input
        type="text"
        name="lastName"
        placeholder="Last Name"
        defaultValue={person.lastName}
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        defaultValue={person.email}
      />
      <button type="submit">Update</button>
    </form>
  );
};

export default EditPersonPage;
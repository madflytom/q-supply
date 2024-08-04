import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

const updateDevice = async (formData: FormData) => {
  'use server';

  const id = formData.get('id') as string;
  const manufacturer = formData.get('manufacturer') as string;
  const model = formData.get('model') as string;
  const osVersion = formData.get('osVersion') as string;
  const imei = formData.get('imei') as string;
  const accessories = formData.get('accessories') as string;
  const conditionNotes = formData.get('conditionNotes') as string;
  const personId = formData.get('personId') as string;
  const previousOwnerId = formData.get('previousOwnerId') as string;

  await prisma.device.update({
    where: {
      id,
    },
    data: {
      manufacturer,
      model,
      osVersion,
      imei,
      accessories,
      conditionNotes,
      personId,
      previousOwnerId,
    },
  });

  revalidatePath('/');
  redirect('/');
};

type DevicePageProps = {
  params: {
    deviceId: string;
  };
};

const DevicePage = async ({ params }: DevicePageProps) => {
  const device = await prisma.device.findUnique({
    where: {
      id: params.deviceId,
    },
  });

  if (!device) {
    return notFound();
  }

  const people = await prisma.person.findMany();

  return (
    <form action={updateDevice}>
      <input type="hidden" name="id" value={device.id} />
      <input
        type="text"
        name="manufacturer"
        placeholder="Manufacturer"
        defaultValue={device.manufacturer}
      />
      <input
        type="text"
        name="model"
        placeholder="Model"
        defaultValue={device.model}
      />
      <input
        type="text"
        name="osVersion"
        placeholder="OS Version"
        defaultValue={device.osVersion}
      />
      <input
        type="text"
        name="imei"
        placeholder="IMEI"
        defaultValue={device.imei}
      />
      <input
        type="text"
        name="accessories"
        placeholder="Accessories"
        defaultValue={device.accessories}
      />
      <input
        type="text"
        name="conditionNotes"
        placeholder="Condition Notes"
        defaultValue={device.conditionNotes}
      />
      
      <select name="personId" defaultValue={device.personId || ''}>
        <option value="">Select Person</option>
        {people.map((person) => (
          <option key={person.id} value={person.id}>
            {person.firstName} {person.lastName}
          </option>
        ))}
      </select>

      <select name="previousOwnerId" defaultValue={device.previousOwnerId || ''}>
        <option value="">Select Previous Owner</option>
        {people.map((person) => (
          <option key={person.id} value={person.id}>
            {person.firstName} {person.lastName}
          </option>
        ))}
      </select>

      <button type="submit">Update</button>
    </form>
  );
};

export default DevicePage;
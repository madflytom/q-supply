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
  const serialNumber = formData.get('serialNumber') as string
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
      serialNumber,
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
    <div className="p-4 flex flex-col gap-y-8">
      <section className="p-4 border rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Edit Device</h2>
        <form action={updateDevice} className="flex flex-col gap-y-2">
          <input type="hidden" name="id" value={device.id} />
          <input
            type="text"
            name="manufacturer"
            placeholder="Manufacturer"
            defaultValue={device.manufacturer}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="model"
            placeholder="Model"
            defaultValue={device.model}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="osVersion"
            placeholder="OS Version"
            defaultValue={device.osVersion}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="imei"
            placeholder="IMEI"
            defaultValue={device.imei}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="accessories"
            placeholder="Accessories"
            defaultValue={device.accessories}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="conditionNotes"
            placeholder="Condition Notes"
            defaultValue={device.conditionNotes}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="serialNumber"
            placeholder="Serial Number"
            defaultValue={device.serialNumber ?? ''}
            className="p-2 border rounded"
          />

          <h3 className="text-xl font-semibold mt-4">Current Owner</h3>
          <select name="personId" defaultValue={device.personId || ''} className="p-2 border rounded">
            <option value="">Select Person</option>
            {people.map((person) => (
              <option key={person.id} value={person.id}>
                {person.firstName} {person.lastName}
              </option>
            ))}
          </select>

          <h3 className="text-xl font-semibold mt-4">Previous Owner</h3>
          <select name="previousOwnerId" defaultValue={device.previousOwnerId || ''} className="p-2 border rounded">
            <option value="">Select Previous Owner</option>
            {people.map((person) => (
              <option key={person.id} value={person.id}>
                {person.firstName} {person.lastName}
              </option>
            ))}
          </select>

          <button type="submit" className="p-2 bg-blue-500 text-white rounded">Update</button>
        </form>
      </section>
    </div>
  );
};

export default DevicePage;
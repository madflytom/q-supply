import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

type PersonPageProps = {
  params: {
    personId: string;
  };
};

const PersonPage = async ({ params }: PersonPageProps) => {
  const person = await prisma.person.findUnique({
    where: {
      id: params.personId,
    },
    include: {
      devices: true, // Include the devices data
      previousDevices: true, // Include the previous devices data
    },
  });

  if (!person) {
    return notFound();
  }

  return (
    <div className="p-4 flex flex-col gap-y-8">
      <section className="p-4 border rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">{person.firstName} {person.lastName}</h2>
        <p className="mb-4">Email: {person.email}</p>
        {person.devices && person.devices.length > 0 && (
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Current Devices:</h3>
            <ul className="list-disc list-inside">
              {person.devices.map((device) => (
                <li key={device.id} className="p-2 border rounded mb-2">
                  {device.model} - {device.manufacturer}
                </li>
              ))}
            </ul>
          </div>
        )}
        {person.previousDevices && person.previousDevices.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-2">Previous Devices:</h3>
            <ul className="list-disc list-inside">
              {person.previousDevices.map((device) => (
                <li key={device.id} className="p-2 border rounded mb-2">
                  {device.model} - {device.manufacturer}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
};

export default PersonPage;
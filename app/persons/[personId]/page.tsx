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
    <div>
      <h2>{person.firstName} {person.lastName}</h2>
      <p>Email: {person.email}</p>
      {person.devices && person.devices.length > 0 && (
        <div>
          <h3>Current Devices:</h3>
          <ul>
            {person.devices.map((device) => (
              <li key={device.id}>
                {device.model} - {device.manufacturer}
              </li>
            ))}
          </ul>
        </div>
      )}
      {person.previousDevices && person.previousDevices.length > 0 && (
        <div>
          <h3>Previous Devices:</h3>
          <ul>
            {person.previousDevices.map((device) => (
              <li key={device.id}>
                {device.model} - {device.manufacturer}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PersonPage;
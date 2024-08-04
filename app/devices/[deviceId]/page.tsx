import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

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
    include: {
      person: true, // Include the person data
      previousOwner: true, // Include the previous owner data
    },
  });

  if (!device) {
    return notFound();
  }

  return (
    <div className="p-4 flex flex-col gap-y-8">
      <section className="p-4 border rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">{device.model}</h2>
        <p className="mb-2">Manufacturer: {device.manufacturer}</p>
        <p className="mb-2">OS Version: {device.osVersion}</p>
        <p className="mb-2">IMEI: {device.imei}</p>
        <p className="mb-2">Accessories: {device.accessories}</p>
        <p className="mb-2">Condition Notes: {device.conditionNotes}</p>
        <p className="mb-2">Date Added to Inventory: {device.dateAddedToInventory.toDateString()}</p>
        {device.dateCheckedOut && <p className="mb-2">Date Checked Out: {device.dateCheckedOut.toDateString()}</p>}
        {device.dateReturned && <p className="mb-2">Date Returned: {device.dateReturned.toDateString()}</p>}
        {device.person && (
          <p className="mb-2">
            Person: {device.person.firstName} {device.person.lastName}
          </p>
        )}
        {device.previousOwner && (
          <p className="mb-2">
            Previous Owner: {device.previousOwner.firstName} {device.previousOwner.lastName}
          </p>
        )}
      </section>
    </div>
  );
};

export default DevicePage;
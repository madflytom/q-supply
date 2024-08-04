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
    <div>
      <h2>{device.model}</h2>
      <p>Manufacturer: {device.manufacturer}</p>
      <p>OS Version: {device.osVersion}</p>
      <p>IMEI: {device.imei}</p>
      <p>Accessories: {device.accessories}</p>
      <p>Condition Notes: {device.conditionNotes}</p>
      <p>Date Added to Inventory: {device.dateAddedToInventory.toDateString()}</p>
      {device.dateCheckedOut && <p>Date Checked Out: {device.dateCheckedOut.toDateString()}</p>}
      {device.dateReturned && <p>Date Returned: {device.dateReturned.toDateString()}</p>}
      {device.person && (
        <p>
          Person: {device.person.firstName} {device.person.lastName}
        </p>
      )}
      {device.previousOwner && (
        <p>
          Previous Owner: {device.previousOwner.firstName} {device.previousOwner.lastName}
        </p>
      )}
    </div>
  );
};

export default DevicePage;
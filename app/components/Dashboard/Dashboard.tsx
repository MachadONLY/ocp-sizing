// app/pages/Dashboard.tsx

import { useRouter } from 'next/router';

const Dashboard = () => {
  const router = useRouter();
  const {
    totalMemory,
    totalCPU,
    nodesNeeded,
    storageNeeded,
    infrastructureType,
    highAvailability,
    futureGrowth,
    clientName,
  } = router.query;

  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      {clientName && <h2 className="text-2xl mt-4">Resultados para: {clientName}</h2>}
      <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
        <p className="text-lg">
          <strong>Total de Memória:</strong> {totalMemory} GB
        </p>
        <p className="text-lg">
          <strong>Total de CPU:</strong> {totalCPU} vCPU
        </p>
        <p className="text-lg">
          <strong>Nós Necessários:</strong> {nodesNeeded}
        </p>
        <p className="text-lg">
          <strong>Armazenamento Necessário:</strong> {storageNeeded} GB
        </p>
        <p className="text-lg">
          <strong>Tipo de Infraestrutura:</strong> {infrastructureType}
        </p>
        <p className="text-lg">
          <strong>Alta Disponibilidade:</strong> {highAvailability}
        </p>
        <p className="text-lg">
          <strong>Crescimento Futuro:</strong> {futureGrowth}%
        </p>
      </div>
    </div>
  );
};

export default Dashboard;

"use client";

import { useState, useRef } from "react";
import { Chart, registerables } from "chart.js"; 
import Aside from "@/app/components/Aside/Aside"; // Verifique se o caminho está correto

Chart.register(...registerables);

const Sizing = () => {
  const [formData, setFormData] = useState({
    clientName: "",
    clusters: "",
    pods: "",
    memoryConsumption: "",
    cpuConsumption: "",
    overhead: "",
    futurePlanning: "",
    nodeCpuCapacity: "",
    nodeMemoryCapacity: "",
    storagePerPod: "",
  });

  const [sizingResult, setSizingResult] = useState<{
    totalMemory: number;
    totalCPU: number;
    nodesNeeded: number;
    storageNeeded: number;
    infrastructureType: string;
    highAvailability: string;
    futureGrowth: number;
    clientName: string;
  } | null>(null);

  const [showDashboard, setShowDashboard] = useState(false);
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const {
      clientName,
      clusters,
      pods,
      memoryConsumption,
      cpuConsumption,
      overhead,
      futurePlanning,
      nodeCpuCapacity,
      nodeMemoryCapacity,
      storagePerPod,
    } = formData;

    const totalPods = parseInt(pods) || 0;
    const totalClusters = parseInt(clusters) || 0;
    const consumptionPerPodMemory = parseFloat(memoryConsumption) || 0;
    const consumptionPerPodCPU = parseFloat(cpuConsumption) || 0;
    const overheadPercentage = parseFloat(overhead) || 0;
    const futureGrowth = parseFloat(futurePlanning) || 0;
    const nodeCpu = parseFloat(nodeCpuCapacity) || 0;
    const nodeMemory = parseFloat(nodeMemoryCapacity) || 0;
    const storagePerPodValue = parseFloat(storagePerPod) || 0;

    const totalMemoryConsumption = totalPods * consumptionPerPodMemory;
    const totalCPUConsumption = totalPods * consumptionPerPodCPU;

    const totalMemoryWithOverhead =
      totalMemoryConsumption + (totalMemoryConsumption * overheadPercentage) / 100;
    const totalCPUWithOverhead =
      totalCPUConsumption + (totalCPUConsumption * overheadPercentage) / 100;

    const totalMemoryWithGrowth =
      totalMemoryWithOverhead + (totalMemoryWithOverhead * futureGrowth) / 100;
    const totalCPUWithGrowth =
      totalCPUWithOverhead + (totalCPUWithOverhead * futureGrowth) / 100;

    const estimatedTotalMemory =
      totalClusters > 0 ? totalMemoryWithGrowth / totalClusters : 0;
    const estimatedTotalCPU = totalClusters > 0 ? totalCPUWithGrowth / totalClusters : 0;

    const nodesNeededForMemory =
      nodeMemory > 0 ? Math.ceil(totalMemoryWithGrowth / nodeMemory) : 0;
    const nodesNeededForCPU = nodeCpu > 0 ? Math.ceil(totalCPUWithGrowth / nodeCpu) : 0;

    const nodesNeeded = Math.max(nodesNeededForMemory, nodesNeededForCPU);
    const totalStorageNeeded = totalPods * storagePerPodValue;

    const result = {
      totalMemory: parseFloat(estimatedTotalMemory.toFixed(2)),
      totalCPU: parseFloat(estimatedTotalCPU.toFixed(2)),
      nodesNeeded,
      storageNeeded: totalStorageNeeded,
      infrastructureType: "Kubernetes Cluster",
      highAvailability: "Sim",
      futureGrowth,
      clientName,
    };

    setSizingResult(result);
    setShowDashboard(true);

    // Cria o gráfico após o cálculo
    if (chartRef.current) {
      new Chart(chartRef.current, {
        type: "bar",
        data: {
          labels: ["Memória Total (GB)", "CPU Total (vCPU)", "Nós Necessários"],
          datasets: [
            {
              label: "Resultados de Sizing",
              data: [result.totalMemory, result.totalCPU, result.nodesNeeded],
              backgroundColor: ["#EE0000", "#FFDD00", "#FF3333"], // Cores Red Hat
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: 'top',
            },
            title: {
              display: true,
              text: 'Resultados de Sizing',
            },
          },
        },
      });
    }
  };

  const handleReset = () => {
    setFormData({
      clientName: "",
      clusters: "",
      pods: "",
      memoryConsumption: "",
      cpuConsumption: "",
      overhead: "",
      futurePlanning: "",
      nodeCpuCapacity: "",
      nodeMemoryCapacity: "",
      storagePerPod: "",
    });
    setSizingResult(null);
    setShowDashboard(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Aside activeTab="dashboard" />

      <div className="flex-1">
        <header className="bg-zinc-900 p-4 h-20"></header>

        <main className="p-6">
          <h2 className="text-3xl font-bold text-gray-700 mb-6">
            Calculadora de Sizing
          </h2>
          {!showDashboard ? (
            <form
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              onSubmit={handleSubmit}
            >
              <div>
                <label className="block mb-1 text-sm font-medium">Nome do Cliente</label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Número de Clusters</label>
                <input
                  type="number"
                  name="clusters"
                  value={formData.clusters}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Número de Pods</label>
                <input
                  type="number"
                  name="pods"
                  value={formData.pods}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Consumo de Memória por Pod (GB)</label>
                <input
                  type="number"
                  name="memoryConsumption"
                  value={formData.memoryConsumption}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Consumo de CPU por Pod (vCPU)</label>
                <input
                  type="number"
                  name="cpuConsumption"
                  value={formData.cpuConsumption}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Overhead (%)</label>
                <input
                  type="number"
                  name="overhead"
                  value={formData.overhead}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Crescimento Futuro (%)</label>
                <input
                  type="number"
                  name="futurePlanning"
                  value={formData.futurePlanning}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Capacidade de CPU por Nó (vCPU)</label>
                <input
                  type="number"
                  name="nodeCpuCapacity"
                  value={formData.nodeCpuCapacity}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Capacidade de Memória por Nó (GB)</label>
                <input
                  type="number"
                  name="nodeMemoryCapacity"
                  value={formData.nodeMemoryCapacity}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Armazenamento por Pod (GB)</label>
                <input
                  type="number"
                  name="storagePerPod"
                  value={formData.storagePerPod}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <button
                type="submit"
                className="mt-4 bg-blue-600 text-white p-2 rounded"
              >
                Calcular
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="mt-4 bg-gray-400 text-white p-2 rounded"
              >
                Resetar
              </button>
            </form>
          ) : (
            <div className="mt-6">
              <h3 className="text-2xl font-bold">Resultados de Sizing</h3>
              {sizingResult && (
                <div className="mt-4">
                  <p><strong>Nome do Cliente:</strong> {sizingResult.clientName}</p>
                  <p><strong>Total de Memória (GB):</strong> {sizingResult.totalMemory}</p>
                  <p><strong>Total de CPU (vCPU):</strong> {sizingResult.totalCPU}</p>
                  <p><strong>Nós Necessários:</strong> {sizingResult.nodesNeeded}</p>
                  <p><strong>Armazenamento Necessário (GB):</strong> {sizingResult.storageNeeded}</p>
                  <p><strong>Tipo de Infraestrutura:</strong> {sizingResult.infrastructureType}</p>
                  <p><strong>Alta Disponibilidade:</strong> {sizingResult.highAvailability}</p>
                  <p><strong>Crescimento Futuro (%):</strong> {sizingResult.futureGrowth}</p>
                </div>
              )}
              <canvas ref={chartRef} className="mt-6"></canvas>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Sizing;

"use client";

import { useState, useRef, useEffect } from "react";
import { Chart, registerables } from "chart.js";
import {
  FaServer,
  FaMemory,
  FaNetworkWired,
  FaShieldAlt,
  FaForward,
} from "react-icons/fa";
import Aside from "@/app/components/Aside/Aside";

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
      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        const myChart = new Chart(ctx, {
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
                position: 'top',
              },
              title: {
                display: true,
                text: 'Resultados do Sizing',
              },
            },
          },
        });
      }
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
              {/* Form Fields */}
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
                className="col-span-1 md:col-span-2 bg-red-600 text-white py-2 rounded hover:bg-red-700"
              >
                Calcular
              </button>
            </form>
          ) : (
            <div className="bg-white shadow-lg rounded p-6">
              <h3 className="text-xl font-bold text-gray-700 mb-4">
                Resultados do Sizing
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-red-50 p-4 rounded border border-red-200">
                  <FaMemory className="text-red-600 mb-2" />
                  <h4 className="font-semibold">Memória Total:</h4>
                  <p>{sizingResult?.totalMemory} GB</p>
                </div>
                <div className="bg-red-50 p-4 rounded border border-red-200">
                  <FaForward className="text-red-600 mb-2" />
                  <h4 className="font-semibold">CPU Total:</h4>
                  <p>{sizingResult?.totalCPU} vCPU</p>
                </div>
                <div className="bg-red-50 p-4 rounded border border-red-200">
                  <FaServer className="text-red-600 mb-2" />
                  <h4 className="font-semibold">Nós Necessários:</h4>
                  <p>{sizingResult?.nodesNeeded}</p>
                </div>
                <div className="bg-red-50 p-4 rounded border border-red-200">
                  <FaNetworkWired className="text-red-600 mb-2" />
                  <h4 className="font-semibold">Armazenamento Necessário:</h4>
                  <p>{sizingResult?.storageNeeded} GB</p>
                </div>
              </div>
              <canvas ref={chartRef} width={400} height={200} />
              <button
                onClick={handleReset}
                className="mt-4 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
              >
                Voltar
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Sizing;

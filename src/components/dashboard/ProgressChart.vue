<template>
  <div class="h-64">
    <Line :data="data" :options="options" />
  </div>
</template>

<script setup lang="ts">
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Props {
  data: any;
}

defineProps<Props>();

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      ticks: {
        callback: function (value: any) {
          return value + "%";
        },
      },
    },
  },
};
</script>

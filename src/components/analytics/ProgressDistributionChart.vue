<template>
  <div class="h-64">
    <Doughnut :data="data" :options="options" />
  </div>
</template>

<script setup lang="ts">
import { Doughnut } from "vue-chartjs";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  data: any;
}

defineProps<Props>();

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom" as const,
    },
  },
};
</script>

<template>
    <div>
      <canvas ref="myCanvas" width="400" height="300"></canvas>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        data: [12, 19, 3, 5, 2, 3],
        barWidth: 40,
        barSpacing: 20,
        canvasWidth: 400,
        canvasHeight: 300,
      };
    },
    mounted() {
      this.drawChart();
    },
    methods: {
      drawChart() {
        const canvas = this.$refs.myCanvas;
        const ctx = canvas.getContext('2d');
  
        const maxValue = Math.max(...this.data);
        const scaleFactor = this.canvasHeight / maxValue;
  
        this.data.forEach((value, index) => {
          const barHeight = value * scaleFactor;
          const x = index * (this.barWidth + this.barSpacing);
          const y = this.canvasHeight - barHeight;
  
          ctx.fillStyle = 'rgba(75, 192, 192, 0.7)';
          ctx.fillRect(x, y, this.barWidth, barHeight);
        });
      },
    },
  };
  </script>
  
  <style scoped>
  </style>
  
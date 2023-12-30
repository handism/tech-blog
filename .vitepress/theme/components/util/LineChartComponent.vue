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
        canvasWidth: 400,
        canvasHeight: 300,
        lineColor: 'rgba(75, 192, 192, 1)',
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
        const dataLength = this.data.length;
  
        ctx.beginPath();
        ctx.moveTo(0, this.canvasHeight - this.data[0] * scaleFactor);
  
        for (let i = 1; i < dataLength; i++) {
          const x = (i / (dataLength - 1)) * this.canvasWidth;
          const y = this.canvasHeight - this.data[i] * scaleFactor;
          ctx.lineTo(x, y);
        }
  
        ctx.strokeStyle = this.lineColor;
        ctx.lineWidth = 2;
        ctx.stroke();
      },
    },
  };
  </script>
  
  <style scoped>
  </style>
  
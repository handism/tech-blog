<template>
    <div>
      <canvas ref="myCanvas" width="400" height="400"></canvas>
    </div>
  </template>
  
  <script>
  export default {
    mounted() {
      const canvas = this.$refs.myCanvas;
      const ctx = canvas.getContext('2d');
  
      const data = [12, 19, 3, 5, 2, 3];
      const colors = [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)',
      ];
  
      const total = data.reduce((acc, value) => acc + value, 0);
      let startAngle = 0;
  
      data.forEach((value, index) => {
        const sliceAngle = (value / total) * (2 * Math.PI);
        const endAngle = startAngle + sliceAngle;
  
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 3, startAngle, endAngle, false);
        ctx.fillStyle = colors[index];
        ctx.fill();
  
        startAngle = endAngle;
      });
    },
  };
  </script>
  
  <style scoped>
  </style>
  
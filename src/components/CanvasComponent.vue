<template>
    <div>
      <canvas ref="canvas" :width="canvasWidth" :height="canvasHeight" style="border: 1px solid #000;"></canvas>
      <button @click="addObject">Add Object</button>
      <button @click="resetCanvas">Reset Canvas</button>
      <button @click="downloadImage">Download Image</button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        canvasWidth: 400,
        canvasHeight: 400,
        objects: [],
      };
    },
    methods: {
      addObject() {
        const colors = ['#FFFF00', '#0000FF', '#FFC0CB'];
        const shapes = ['star', 'circle', 'heart'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
  
        this.objects.push({
          color: randomColor,
          shape: randomShape,
          x: Math.random() * this.canvasWidth,
          y: Math.random() * this.canvasHeight,
        });
  
        this.drawObjects();
      },
      resetCanvas() {
        this.objects = [];
        this.drawObjects();
      },
      drawObjects() {
        const canvas = this.$refs.canvas;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  
        this.objects.forEach((obj) => {
          context.fillStyle = obj.color;
  
          if (obj.shape === 'star') {
            this.drawStar(context, obj.x, obj.y, 5, 10, 5);
          } else if (obj.shape === 'circle') {
            context.beginPath();
            context.arc(obj.x, obj.y, 10, 0, 2 * Math.PI);
            context.fill();
          } else if (obj.shape === 'heart') {
            this.drawHeart(context, obj.x, obj.y, 10);
          }
        });
      },
      drawStar(context, cx, cy, spikes, outerRadius, innerRadius) {
        let rot = (Math.PI / 2) * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;
  
        context.beginPath();
        context.moveTo(cx, cy - outerRadius);
  
        for (let i = 0; i < spikes; i++) {
          x = cx + Math.cos(rot) * outerRadius;
          y = cy + Math.sin(rot) * outerRadius;
          context.lineTo(x, y);
          rot += step;
  
          x = cx + Math.cos(rot) * innerRadius;
          y = cy + Math.sin(rot) * innerRadius;
          context.lineTo(x, y);
          rot += step;
        }
  
        context.lineTo(cx, cy - outerRadius);
        context.closePath();
        context.fillStyle = '#FFFF00';
        context.fill();
      },
      drawHeart(context, x, y, size) {
        context.beginPath();
        context.moveTo(x, y);
        context.bezierCurveTo(x, y - size / 2, x - size, y - size / 2, x - size, y);
        context.bezierCurveTo(x - size, y + size / 4, x, y + size, x + size, y + size / 4);
        context.bezierCurveTo(x + size, y - size / 2, x, y - size, x, y);
        context.fillStyle = '#FFC0CB';
        context.fill();
      },
      downloadImage() {
        const canvas = this.$refs.canvas;
  
        canvas.toBlob((blob) => {
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = 'canvas_image.png';
          link.click();
        });
      },
    },
  };
  </script>
  
  <style scoped>
  </style>
  
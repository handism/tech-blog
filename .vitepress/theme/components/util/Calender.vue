<!-- Calendar.vue -->

<template>
    <div class="calendar">
      <h2>{{ month }} {{ year }} カレンダー</h2>
      <table>
        <thead>
          <tr>
            <th v-for="day in daysOfWeek" :key="day">{{ day }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="week in calendar" :key="week">
            <td v-for="day in week" :key="day.date" :class="{ 'today': isToday(day), 'selected': isSelected(day) }" @click="selectDate(day)">
              {{ day.day }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        daysOfWeek: ['日', '月', '火', '水', '木', '金', '土'],
        selectedDate: null,
        today: new Date(),
      };
    },
    computed: {
      month() {
        return this.selectedDate ? this.selectedDate.toLocaleString('default', { month: 'long' }) : this.today.toLocaleString('default', { month: 'long' });
      },
      year() {
        return this.selectedDate ? this.selectedDate.getFullYear() : this.today.getFullYear();
      },
      calendar() {
        const firstDayOfMonth = new Date(this.year, this.selectedDate ? this.selectedDate.getMonth() : this.today.getMonth(), 1);
        const lastDayOfMonth = new Date(this.year, this.selectedDate ? this.selectedDate.getMonth() + 1 : this.today.getMonth() + 1, 0);
        const startDate = new Date(firstDayOfMonth);
        startDate.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay());
        const endDate = new Date(lastDayOfMonth);
        endDate.setDate(lastDayOfMonth.getDate() + (6 - lastDayOfMonth.getDay()));
  
        const calendar = [];
        let currentDate = new Date(startDate);
  
        while (currentDate <= endDate) {
          const week = [];
          for (let i = 0; i < 7; i++) {
            week.push({
              date: new Date(currentDate),
              day: currentDate.getDate(),
            });
            currentDate.setDate(currentDate.getDate() + 1);
          }
          calendar.push(week);
        }
  
        return calendar;
      },
    },
    methods: {
      isToday(date) {
        return date.date.toDateString() === this.today.toDateString();
      },
      isSelected(date) {
        return this.selectedDate && date.date.toDateString() === this.selectedDate.toDateString();
      },
      selectDate(date) {
        this.selectedDate = date.date;
      },
    },
  };
  </script>
  
  <style scoped>
  .calendar {
    font-family: 'Arial', sans-serif;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
  }
  
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
  }
  
  th {
    background-color: #f2f2f2;
  }
  
  td {
    cursor: pointer;
  }
  
  .today {
    background-color: #e6f7ff;
  }
  
  .selected {
    background-color: #99ccff;
  }
  </style>
  
<template>
    <footer>
        <div class="footer-content">
            <small>©︎ {{ currentYear }} frontend-vue-utillity.</small>
        </div>
    </footer>
</template>

<script>
export default {
    data() {
        return {
            curretntYear: new Date().getFullYear(),
        };
    },
};
</script>

<style scoped>
footer {
    background-color: #2c3e50;
    color: #ecf0f1;
    text-align: center;
    padding: 20px 0;
    bottom: 0;
    width: 100%
}

.footer-content {
    align-items: center;
}

small {
    color: #bdc3c7;
}
</style>
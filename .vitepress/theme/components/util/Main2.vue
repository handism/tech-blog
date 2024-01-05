<template>
    <main>
        <section class="main-section">
            <h1>Welcome</h1>
            <RouterView />
        </section>
    </main>
</template>

<script>
</script>

<style scoped>
main {
    background-color: #ecf0f1;
    padding: 20px;
}

.main-section {
    margin: 0 auto;
    text-align: center;
}

h1 {
    color: #3498db;
}
</style>
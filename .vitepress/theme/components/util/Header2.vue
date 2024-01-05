<template>
    <header>
        <nav>
            <router-link
                v-for="route in routes"
                :key="route.path"
                :to="route.path"
                class="nav-link"
            >
                {{ route.name }}
            </router-link>
        </nav>
    </header>
</template>

<script>
export default {
    data() {
        return {
            routes: [
                {path: '/', name: 'Home'},
                {path: '/draw-canvas', name: 'DrawCanvas'},
                {path: '/charts', name: 'Charts'},
            ]
        };
    }
};
</script>

<style scoped>
nav {
    background-color: #34495e;
    padding: 10px;
    display: flex;
    justify-content: space-around;
    align-items: center;
}

.nav-link {
    color: #ecf0f1;
    text-decoration: none;
    font-size: 16px;
    transition: color 0.3s ease;
}

.nav-link:hover {
    color: #e74c3c;
}
</style>
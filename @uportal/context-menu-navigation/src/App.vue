<template>
    <div class="container">
        <context-menu-navigation layout-api-url="layout.json" debug></context-menu-navigation>
    </div>
</template>

<script>
import ContextMenuNavigation from './components/ContextMenuNavigation.vue';

export default {
    name: 'app',
    components: {
        ContextMenuNavigation
    }
};
</script>

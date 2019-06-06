<template>
    <div class="container">
        <context-menu-navigation
            ignore="myHome"
            layout-api-url="layout.json"
            portlet-api-url="portletRegistry.json"
            class="context-menu-nav"
            debug
        ></context-menu-navigation>
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

<style lang="scss">
@import '../node_modules/bootstrap/scss/bootstrap';

html {
    font-size: 14px;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

body {
    color: white;
    font-size: 14px;
    padding: 0;
    margin: 0;
}
</style>

<template>
    <div class="container">
        <context-menu-navigation
            ignore="myHome"
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
    font-size: 10px;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

body {
    color: white;
    font-size: 14px;
    padding: 0;
    margin: 0;
}

.context-menu-nav {
    --cm-menu-bg-color: #bbb;
}
</style>

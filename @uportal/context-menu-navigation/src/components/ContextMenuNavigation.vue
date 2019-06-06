<template>
    <nav
        class="navigation"
        @keydown.escape="closeTabs()"
        @mouseleave="closeTabs()"
        ref="navigation"
    >
        <ul class="nav nav-pills nav-justified">
            <li
                v-for="(tab, tabIndex) in tabs"
                :key="tabIndex"
                class="nav-item dropdown"
                :class="{ show: selected === tab.ID }"
            >
                <button
                    class="nav-link dropdown-toggle btn btn-link"
                    aria-haspopup="true"
                    :aria-expanded="selected === tab.ID"
                    href="#"
                    @focus="closeTabs()"
                    @mouseover="openTab(tab.ID)"
                    @keydown.down="openTab(tab.ID)"
                    @keydown.enter="openTab(tab.ID)"
                >
                    {{ tab.name }}
                </button>
                <context-menu
                    @component-blur="closeTabs()"
                    :tab="tab"
                    :is-open="selected === tab.ID"
                    :drop-direction="
                        tabIndex >= Math.ceil(layout.navigation.tabs.length / 2)
                            ? 'dropleft'
                            : 'dropright'
                    "
                    :registry="registry"
                ></context-menu>
            </li>
        </ul>
    </nav>
</template>
<script>
import oidc from '@uportal/open-id-connect';
import Vue from 'vue';
import AsyncComputed from 'vue-async-computed';
import ky from 'ky';
import { portletRegistryToArray } from '@uportal/portlet-registry-to-array';

import ContextMenu from './ContextMenu';

Vue.use(AsyncComputed);

export default {
    name: 'ContextMenuNavigation',
    components: {
        ContextMenu
    },
    data() {
        return {
            selected: null
        };
    },
    props: {
        ignore: {
            type: String,
            default: ''
        },
        debug: {
            type: Boolean,
            default: false
        },
        layoutApiUrl: {
            type: String,
            default: '/uPortal/api/v4-3/dlm/layout.json'
        },
        portletApiUrl: {
            type: String,
            default: '/uPortal/api/v4-3/dlm/portletRegistry.json'
        }
    },
    methods: {
        toggleTab(id) {
            this.selected = this.selected === id ? null : id;
        },
        openTab(id) {
            this.selected = id;
        },
        closeTabs() {
            this.selected = null;
        },
        handleOutsideClick(event) {
            const menu = this.$refs.navigation;
            const target = event.target;
            const shadow = target.shadowRoot ? target.shadowRoot : false;
            if (menu && menu !== target && !shadow && !menu.contains(target)) {
                this.closeTabs();
            }
        }
    },
    mounted() {
        document.addEventListener('click', this.handleOutsideClick, false);
    },
    computed: {
        ignoreFolders() {
            return this.ignore.split(',');
        },
        tabs() {
            return this.layout.navigation.tabs.filter(
                tab => !(this.ignoreFolders.indexOf(tab.name) > -1)
            );
        }
    },
    asyncComputed: {
        layout: {
            async get() {
                const { layoutApiUrl, debug } = this;
                try {
                    const headers = debug
                        ? {}
                        : {
                              Authorization: 'Bearer ' + (await oidc()).encoded,
                              'content-type': 'application/jwt'
                          };
                    return (await ky.get(layoutApiUrl, { headers }).json()).layout;
                } catch (err) {
                    // eslint-disable-next-line no-console
                    console.error(err);
                    return {};
                }
            },
            default: {
                navigation: {
                    tabs: []
                }
            }
        },
        registry: {
            async get() {
                const { portletApiUrl, debug } = this;
                try {
                    const headers = debug
                        ? {}
                        : {
                              Authorization: 'Bearer ' + (await oidc()).encoded,
                              'content-type': 'application/jwt'
                          };

                    return portletRegistryToArray(await ky.get(portletApiUrl, { headers }).json());
                } catch (err) {
                    // eslint-disable-next-line no-console
                    console.error(err);
                    return {};
                }
            },
            default: []
        }
    }
};
</script>
<style lang="scss" scoped>
@import '../variables.scss';
.navigation /deep/ {
    @import '../../node_modules/bootstrap/scss/bootstrap';

    .nav.nav-pills {
        > .nav-item {
            max-width: 50%;
            > .nav-link {
                text-align: left;
                text-align: var(--cm-nav-item-text-align, left);
                padding: 7px 21px;
                padding: var(--cm-nav-item-padding, 7px 21px);
            }
            &.show > .nav-link,
            > .nav-link:focus {
                background-color: $grey;
                background-color: var(--cm-nav-item-active-bg-color, $grey);
                border-radius: 0;
                color: white;
                color: var(--cm-nav-item-active-fg-color, white);
            }
        }
        .dropdown-toggle::before,
        .dropdown-toggle::after {
            display: none !important;
            display: var(--cm-nav-item-caret-display, none !important);
        }
    }
}
</style>

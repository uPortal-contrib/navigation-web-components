<template>
    <div class="navigation">
        <ul class="nav nav-pills">
            <li class="nav-item" v-for="(item, index) in this.layout.navigation.tabs" :key="index">
                <a class="nav-link active" href="#">{{ item.name }}</a>
            </li>
        </ul>
    </div>
</template>
<script>
import oidc from '@uportal/open-id-connect';
import Vue from 'vue';
import AsyncComputed from 'vue-async-computed';
import ky from 'ky';

Vue.use(AsyncComputed);

export default {
    name: 'ContextMenuNavigation',
    data() {
        return {
            layout: {}
        };
    },
    filters: {
        json: function(value) {
            return JSON.stringify(JSON.parse(value), null, 2);
        }
    },
    props: {
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
        }
    }
};
</script>
<style lang="scss" scoped>
.navigation {
    @import '../../node_modules/bootstrap/scss/bootstrap';
}
</style>

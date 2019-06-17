<template>
    <ul
        :class="{ show: isOpen }"
        class="dropdown-menu context-menu"
        role="navigation"
        @keydown="handleKeyDown"
    >
        <template v-for="(column, columnIndex) in tab.content">
            <li class="dropdown-header" :key="columnIndex">
                <h6>{{ column.name }}</h6>
            </li>
            <li
                v-for="(content, contentIndex) in column.content"
                :key="`${columnIndex}-${contentIndex}`"
                class="dropdown-submenu"
                :class="[dropDirection, { show: selected === content.fname }]"
                :ref="'content-' + content.fname"
            >
                <a
                    class="dropdown-item dropdown-toggle"
                    :href="content.parameters.alternativeMaximizedLink"
                    :target="content.parameters.target"
                    :ref="content.fname"
                    @mouseover="toggleContent(content)"
                    @focus="toggleContent(content)"
                    :class="{ active: content.fname === selected }"
                    >{{ content.name }}</a
                >
                <div
                    :class="{ show: selected === content.fname }"
                    class="dropdown-menu context-menu"
                    :style="{ transform: 'translateY(' + offset + ')', minHeight: height }"
                    v-if="portletContent"
                >
                    <WidgetRenderer
                        class="portlet-content"
                        :template="
                            portletContent
                                ? portletContent.widgetTemplate || portletContent.description
                                : ''
                        "
                        :config="portletContent.widgetConfig"
                        :url="portletContent.widgetUrl"
                        :type="portletContent.widgetType"
                    />
                </div>
            </li>
        </template>
    </ul>
</template>
<script>
import WidgetRenderer from '@uportal/content-renderer/src/components/WidgetRenderer';

export const keyCodes = {
    13: 'enter',
    27: 'escape',
    32: 'space',
    38: 'up',
    40: 'down'
};

export default {
    name: 'ContextMenu',
    components: {
        WidgetRenderer
    },
    data() {
        return {
            selected: null
        };
    },
    props: {
        tab: {
            type: Object,
            default: () => {
                return {
                    ID: '',
                    name: '',
                    fname: '',
                    content: []
                };
            }
        },
        registry: {
            type: Array,
            default: () => []
        },
        isOpen: {
            type: Boolean,
            default: false
        },
        dropDirection: {
            type: String,
            default: 'dropright'
        }
    },
    updated() {
        if (this.isOpen && !this.selected) {
            this.handleOptionFocus(0);
        }
    },
    methods: {
        handleKeyDown(event) {
            switch (keyCodes[event.keyCode]) {
                case 'up':
                    this.handleUpArrow(event);
                    break;
                case 'down':
                    this.handleDownArrow(event);
                    break;
                case 'escape':
                    this.handleComponentBlur();
                    break;
            }
        },
        handleUpArrow(event) {
            event.preventDefault();
            const { isOpen, indexOfSelected } = this;
            const isNotAtTop = indexOfSelected !== 0;
            const allowMoveUp = isNotAtTop && isOpen;
            if (allowMoveUp) {
                this.handleOptionFocus(indexOfSelected - 1);
            } else {
                this.handleComponentBlur();
            }
        },
        handleDownArrow(event) {
            event.preventDefault();
            const { isOpen, indexOfSelected, contentRegistry } = this;
            const isNotAtBottom = indexOfSelected !== contentRegistry.length - 1;
            const allowMoveDown = isNotAtBottom && isOpen;
            if (allowMoveDown) {
                this.handleOptionFocus(indexOfSelected + 1);
            }
        },
        handleOptionFocus(index) {
            const fname = this.contentRegistry[index];
            this.selected = fname;
            this.$nextTick(() => this.$refs[fname][0].focus());
        },
        handleComponentBlur() {
            this.$emit('component-blur');
        },
        toggleContent(content) {
            this.handleOptionFocus(this.getIndex(content.fname));
        },
        getIndex(fname) {
            return this.contentRegistry.indexOf(fname);
        }
    },
    computed: {
        indexOfSelected() {
            const { contentRegistry, selected } = this;
            return contentRegistry.indexOf(selected);
        },
        offset() {
            return this.selected ? -this.$refs['content-' + this.selected][0].offsetTop + 'px' : 0;
        },
        ignoreFolders() {
            return this.ignore.split(',');
        },
        tabs() {
            return this.layout.navigation.tabs.filter(
                tab => !(this.ignoreFolders.indexOf(tab.name) > -1)
            );
        },
        portletContent() {
            return this.registry
                ? this.registry.find(portlet => portlet.fname === this.selected)
                : {};
        },
        contentRegistry() {
            return this.tab.content
                .reduce((collection, group) => [...collection, ...group.content], [])
                .map(c => c.fname);
        }
    }
};
</script>
<style lang="scss" scoped>
@import '../variables.scss';

.navigation .dropdown-menu.context-menu /deep/,
.dropdown-menu.context-menu /deep/ {
    min-width: 100%;
    border: none;
    border: var(--cm-menu-border, none);
    border-radius: 0;
    border-radius: var(--cm-menu-border-radius, 0);
    background: #bbb;
    background: var(--cm-menu-bg-color, #bbb);
    margin: 0;
    padding-top: 0;
    box-sizing: border-box;

    .dropdown-header > h6 {
        color: darken($white, 20%);
        font-size: 14px;
        font-size: var(--cm-menu-font-size, 14px);
    }

    > .dropdown-submenu {
        > .dropdown-item {
            color: $white;
            font-size: 14px;
            font-size: var(--cm-menu-font-size, 14px);

            &.active,
            &:focus,
            &:hover {
                background-color: black;
                background-color: var(--cm-menu-item-active-bg-color, black);
                color: white;
                color: var(--cm-menu-item-active-fg-color, white);
                outline: none;
            }
        }
        > .dropdown-menu {
            background: black;
            background: var(--cm-submenu-bg-color, black);
            margin: 0;
            &,
            & pre {
                color: var(--cm-submenu-fg-color, white);
            }
        }

        .portlet-content {
            padding: 16px;
            padding: var(--cm-submenu-content-padding, 16px);
            font-size: 14px;
            font-size: var(--cm-menu-font-size, 14px);
            color: #f5f5f5;
            color: var(--cm-menu-fg-color, #f5f5f5);

            a {
                color: #d8d8d8;
                color: var(--cm-menu-link-fg-color, #d8d8d8);
                text-decoration: none;

                &:hover {
                    text-decoration: underline;
                    color: #e5e5e5;
                    color: var(--cm-menu-link-fg-hover-color, #e5e5e5);
                }
            }

            img {
                width: 100%;
                height: auto;
                margin: 8px 0;
                &:first-child {
                    margin-top: 0;
                }
                &:last-child {
                    margin-bottom: 0;
                }
            }
        }
    }
}
</style>

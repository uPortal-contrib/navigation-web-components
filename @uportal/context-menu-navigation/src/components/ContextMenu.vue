<template>
    <ul
        :class="{ show: isOpen }"
        class="dropdown-menu context-menu"
        role="navigation"
        ref="context-menu"
        @keydown="handleKeyDown"
    >
        <template v-for="(column, columnIndex) in tab.content">
            <li class="dropdown-header mt-4" :key="columnIndex">
                <h6 class="mb-0">{{ column.name }}</h6>
            </li>
            <li
                v-for="(content, contentIndex) in column.content"
                :key="`${columnIndex}-${contentIndex}`"
                class="dropdown-submenu"
                :class="[
                    dropDirection,
                    {
                        show: selected === content.fname,
                        maintenance: content.lifecycleState === 'MAINTENANCE'
                    }
                ]"
                :ref="'content-' + content.fname"
            >
                <a
                    class="dropdown-item dropdown-toggle"
                    :href="
                        content.lifecycleState === 'MAINTENANCE'
                            ? '#'
                            : content.parameters.alternativeMaximizedLink
                    "
                    :target="
                        content.lifecycleState === 'MAINTENANCE'
                            ? '_self'
                            : content.parameters.target
                    "
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
                    <div
                        class="portlet-content"
                        v-if="content.lifecycleState === 'MAINTENANCE'"
                        :title="content.parameters.customMaintenanceMessage"
                        :style="{ minHeight: height }"
                    >
                        <div class="content-title mb-2">{{ content.name }}</div>
                        <h2
                            class="text-warning h1 mb-0"
                            :style="{ display: 'flex', alignItems: 'center' }"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                                class="bi bi-exclamation-circle"
                            >
                                <path
                                    d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
                                ></path>
                                <path
                                    d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"
                                ></path>
                            </svg>
                            &nbsp; Out of Service
                        </h2>
                    </div>
                    <WidgetRenderer
                        v-else
                        class="portlet-content"
                        :template="cleanWidgetTemplate"
                        :url="portletContent.parameters.widgetUrl"
                        :type="portletContent.parameters.widgetType"
                    />
                </div>
            </li>
        </template>
    </ul>
</template>
<script>
import WidgetRenderer from '@uportal/content-renderer/src/components/WidgetRenderer';
import debugFactory from 'debug';
const debugLogger = debugFactory('up:context-nav-menu');

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
        height() {
            return this.$refs['context-menu'].clientHeight + 'px';
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
            const selDetails = this.contentItemDetails;
            if (selDetails) {
                const retVal =
                    selDetails.parameters && selDetails.parameters.widgetType ? selDetails : false;
                debugLogger(
                    'portletContent: [',
                    this.selected,
                    '].  retVal=[',
                    retVal,
                    '].  Selected details:'
                );
                debugLogger(selDetails);
                return retVal;
            } else {
                debugLogger('portletContent: [', this.selected, '].  No selected details found.');
                return false;
            }
        },
        contentRegistry() {
            return this.tab.content
                .reduce((collection, group) => [...collection, ...group.content], [])
                .map(c => c.fname);
        },
        contentItemDetails() {
            if (this.selected) {
                return this.tab.content
                    .reduce((collection, group) => [...collection, ...group.content], [])
                    .find(c => c.fname == this.selected);
            } else {
                return this.selected;
            }
        },
        cleanWidgetTemplate() {
            const escapedXmlMapping = {
                '&lt;': '<',
                '&gt;': '>',
                '&quot;': '"',
                '&apos;': "'",
                '&amp;': '&'
            };
            const wTemplate = this.contentItemDetails?.parameters?.widgetTemplate;
            if (wTemplate) {
                return wTemplate.replace(/(&quot;|&lt;|&gt;|&apos;|&amp;)/g, function(str, marker) {
                    return escapedXmlMapping[marker];
                });
            }
            return this.contentItemDetails?.description;
        }
    }
};
</script>
<style lang="scss" scoped>
.navigation .dropdown-menu.context-menu /deep/,
.dropdown-menu.context-menu /deep/ {
    min-width: 100%;
    max-width: 100%;
    width: 100%;
    border: none;
    border: var(--cm-menu-border, none);
    border-radius: 0;
    border-radius: var(--cm-menu-border-radius, 0);
    background: #666;
    background: var(--cm-menu-bg-color, #666);
    margin: 0;
    padding-top: 0;
    box-sizing: border-box;

    .dropdown-header > h6 {
        color: darken(white, 20%);
        font-size: 14px;
        font-size: var(--cm-menu-font-size, 14px);
    }

    > .dropdown-submenu {
        color: white;

        &.maintenance {
            .dropdown-item,
            .content-title {
                text-decoration: line-through;
                cursor: default;
            }
        }

        > .dropdown-item {
            color: white;
            font-size: 14px;
            font-size: var(--cm-menu-font-size, 14px);

            &.active,
            &:focus,
            &:hover {
                background-color: black;
                background-color: var(--cm-menu-item-active-bg-color, black);
                color: black;
                color: var(--cm-menu-item-active-fg-color, white);
                outline: none;
            }
        }

        > .dropdown-menu {
            background: black;
            background: var(--cm-submenu-bg-color, black);
            margin: 0;
            min-height: 100%;
            color: var(--cm-submenu-fg-color, white);
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

# Context Menu Navigation List

[![NPM Version](https://img.shields.io/npm/v/@uportal/context-menu-navigation.svg)](https://www.npmjs.com/package/@uportal/context-menu-navigation)
[![Maven Central](https://maven-badges.herokuapp.com/maven-central/org.webjars.npm/uportal__context-menu-navigation/badge.svg)](https://maven-badges.herokuapp.com/maven-central/org.webjars.npm/uportal__context-menu-navigation)
[![Build Status](https://travis-ci.org/uPortal-contrib/notification-web-components.svg?branch=master)](https://travis-ci.org/uPortal-contrib/notification-web-components)

## Development

```bash
# clone the repository if you haven't already
git clone https://github.com/uPortal-contrib/notification-web-components

# navigate to the context-menu-navigation folder
cd uPortal-web-components/@uportal/context-menu-navigation

# install the goods
npm install

# start the app
npm start
```

## Build

Pretty simple:

`npm run build`

This will compile your JavaScript in to `build/static/js/main.{buildnumbers}.js`

## Usage

After building, grab the compiled javascript files and place it on your page.
You can now place `<context-menu-navigation>` anywhere on your page.

Here's the guts of that html file:

```html
<context-menu-navigation> </context-menu-navigation>
```

-   Note: The component includes bootstrap, so that you can use bootstrap's styles in your content slots. However, font-awesome has issues crossing the shadow-dom boundry, so that if you include an icon in the content slot, you also need to include a `<link>` to the font-awesome stylesheet from uPortal (or elsewhere if you wish).

##### Notice

We have a `/proxy/` leading the `oidc-url` attribute. This is a developer convenience to be able to query against your local running instance of uPortal. The proxy is configured in `package.json`:

```json
  "proxy": {
    "/proxy": {
      "target": "http://localhost:8080",
      "changeOrigin": true,
      "pathRewrite": {
        "^/proxy": "/"
      }
    }
  },
```

## Attributes

`<context-menu-navigation>` takes the following attributes:

### `notification-api-url`

Url to connect notification-endpoint. Defaults to `/NotificationPortlet/api/v2/notifications`.

```html
<context-menu-navigation
    oidc-url="/NotificationPortlet/api/v2/notifications"
></context-menu-navigation>
```

### `oidc-url`

Url to connect to oidc. The default for this value is `/uPortal/api/v5-1/userinfo`.

```html
<context-menu-navigation oidc-url="/uPortal/api/v5-1/userinfo"></context-menu-navigation>
```

### `color-map`

A map of colors associated with notification categories. The component will choose the first category defined to determine this.

```html
<context-menu-navigation
    color-map='{
  "Announcement": "#6649bb",
  "Holds": "#487df9",
  "To-Do": "#c85a89"
}'
></context-menu-navigation>
```

### `debug`

Skips oidc call for api token.

```html
<context-menu-navigation debug></context-menu-navigation
```

### Theming

Currently this component supports [CSS Variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_variables) for overriding button colors. Defining the following variables will change the colors for the component accordingly. They will fall back to the colors described below.

You should define this in your custom stylesheet.

fg = foreground (text)
bg = background

```css
:root {
    --notif-list-icon-ph-color: #999; /* color of list icon (category) default color */
    --notif-unread-bg-color: aliceblue; /* background color of unread notifications */
    --notif-read-bg-color: white; /* background color of read notifications */
    --notif-highlight-bg-color: honeydew; /* background color of highlighted notifications */
    --notif-list-item-dd-width: 12px; /* size of ellipsis-v icon trigger for dropdown */
    --notif-list-item-dd-height: 28px; /* size of ellipsis-v icon trigger for dropdown */
}
```

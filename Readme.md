# Shopify Scaffold

## Installation

1. After cloning the repo, run the following command to install required development javascript packages:

    ```sh
    npm install
    ```

2. Copy `config.example.yml` to `config.yml` and add application secrets from:

    https://<shop_name>.myshopify.com/admin/apps/private

3. Before you start development, start grunt watcher to watch for file changes and
automatically upload them to shopify:

    ```sh
    grunt
    ```

Note: Shopify does not allow subdirectories in `/assets` directory.
All files in `/assets/stylesheets`, `/assets/javascripts` and `/assets/svgs`
will be automatically compiled and added to `/assets` directory. The other subdirectories are
ignored.

Images should be placed in `/assets` directory, without any specific subdirectory.

## Adding dev dependencies

To add a development dependency, such as grunt dependencies (svgstore, uglify, etc.),
find the [npm package](https://www.npmjs.com/) you'd like to add and run:

```sh
yarn add --dev <package_name>
```

If you don't have `yarn`, install it from `npm`:

```sh
npm install -g yarn
```

## Adding runtime dependencies

To add a javascript/stylesheet library that will be used in production, such as `jQuery` or
`Zurb Foundation`, find the [bower package](http://bower.io/) you'd like to add and run:

```sh
bower install <package_name> --save
```

Check `/assets/javascripts/vendor` directory and remove any unnecessary additional files
that were downloaded.

yaml = require('js-yaml');
fs   = require('fs');

// Get document, or throw exception on error
try {
  var localConfig = yaml.safeLoad(fs.readFileSync('./config.yml', 'utf8'));
  var required_keys = [':api_key', ':password', ':store'];
  required_keys.forEach(function(key) {
    if (!localConfig[key] || localConfig[key].trim().length === 0) {
      console.error('Please specify ' + key + ' in config.yml!');
    }
  })
} catch (e) {
  console.error('An error occured while reading config.yml.');
  console.error('Please make sure you run: cp config.example.yml config.yml');
  console.error('From the project root directory.');
  console.error(e);
}


module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    babel: {
      options: {
        presets: ['es2015-script']
      },
      all: {
        files: [{
          cwd: 'src',
          expand: true,
          src: ['assets/javascripts/**/*.js'],
          dest: 'build/'
        }]
      }
    },
    clean: ['build/assets/javascripts/**/*.js'],
    sync: {
      main: {
        files: [
          {
            cwd: 'src/',
            src: ['**/*.liquid', 'config/settings_schema.json'],
            dest: 'build/'
          },
        ],
        verbose: true,
      },
    },
    sass: {
      compile: {
        options: {
          sourcemap: 'none',
          style: 'compressed',
          // lineNumbers: true
        },
        files: [{
          expand: true,
          cwd: 'src/assets/stylesheets',
          src: ['**/*.scss'],
          dest: 'build/assets/tmp',
          ext: '.scss.liquid',
        }],
      },
    },
    postcss: {
      options: {
        processors: [
          require('autoprefixer') ({
              browsers: ['> 2%']
          })
        ],
      },
      dist: {
        src: 'build/assets/tmp/application.scss.liquid',
        dest: 'build/assets/application.scss.liquid'
      },
    },
    shopify: {
      options: {
        api_key: localConfig[':api_key'],
        password: localConfig[':password'],
        url: localConfig[':store'],
        theme: localConfig[':theme_id'],
        disable_growl_notifications: false,
        base: 'build/'
      },
    },
    svgstore: {
      options: {
        cleanupdefs: true,
      },
      default: {
        files: {
          'build/snippets/icons.svg.liquid': ['src/assets/svgs/*.svg']
        },
      },
    },
    uglify: {
      options: {
        // beautify: true,
        // mangle: false
      },
      my_target: {
        files: {
          'build/assets/application.js': [
            'build/assets/javascripts/vendor/**/*.js',
            'build/assets/javascripts/shopify/**/*.js',
            'build/assets/javascripts/**/*.js'
          ],
        },
      },
    },
    watch: {
      babel: {
        files: 'src/assets/javascripts/**/*.js',
        tasks: ['babel']
      },
      sync: {
        files: ['src/**/*.liquid', 'src/config/**'],
        tasks: ['sync']
      },
      css: {
        files: [ 'src/assets/stylesheets/**/*.scss'],
        tasks: ['sass', 'postcss'],
      },
      shopify: {
        files: [
          'build/assets/*',
          'build/config/**',
          'build/layout/**',
          'build/locales/**',
          'build/snippets/**',
          'build/templates/**',
        ],
        tasks: ['shopify'],
      },
      svgstore: {
        files: ['src/assets/svgs/*.svg'],
        tasks: ['svgstore'],
      },
      uglify: {
        files: ['build/assets/javascripts/**/*.js'],
        tasks: ['uglify'],
      },
    },
  });

  grunt.registerTask('default', ['watch']);
};

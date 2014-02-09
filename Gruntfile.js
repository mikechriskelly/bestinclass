module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // Shell commands to send to jekyll
    shell: {
      build: {
        command: 'jekyll build'
      },
      serve: {
        command: 'jekyll serve'
      },
    },
    // Compass compilation task.
    compass: {
      dist: {
        options: {
          config: 'config.rb',
          bundleExec: true, // Execute our compass command with bundle exec.
        }
      }
    },
    // Compile and compress source javascript files
    uglify: {
      javascripts: {
        options: {
          sourceMap: true,
          sourceMapName: 'js/sourcemap.map'
        },
        files: {
          'js/main.min.js': ['_javascripts/bootstrap.min.js', '_javascripts/hovernav.js']
        }
      }
    },
    // The default task we leave running to watch for file changes.
    watch: {
      css: {
        files: '_sass/*.scss',
        tasks: ['compass']
      },
      js: {
        files: '_javascripts/**/*.js',
        tasks: ['uglify:javascripts']
      },
      html: {
        files: [
          '_includes/*.html',
          '_layouts/*.html',
          '_posts/*.markdown',
          '_config.yml',
          '*.html'
        ],
        tasks: ['shell:build','shell:serve'],
        options: {
          interrupt: true,
          atBegin: true
        }
      }
    }
  });
  // Load extension for running shell commands
  grunt.loadNpmTasks('grunt-shell');
  // Load the 'watch' task extension.
  grunt.loadNpmTasks('grunt-contrib-watch');
  // Load extension for jekyll
  grunt.loadNpmTasks('grunt-jekyll');
  // Load extension to compile sass/compass.
  grunt.loadNpmTasks('grunt-contrib-compass');
  // Load extension to compile and minify javascript 
  grunt.loadNpmTasks('grunt-contrib-uglify');
  // Register default task to watch for file changes.
  grunt.registerTask('default',['watch']);
};
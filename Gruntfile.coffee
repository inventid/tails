module.exports = ( grunt ) ->
  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')

    meta:
      banner:
        '// Tails\n' +
        '// version: <%= pkg.version %>\n' +
        '// contributors: <%= pkg.contributors %>\n' +
        '// license: <%= pkg.licenses[0].type %>\n'

    coffee:
      dist:
        options:
          join: true
        files:
          'dist/tails.js': [
            'src/tails.coffee'
            'src/utils/hash.coffee'
            'src/mixins/interceptable.coffee'
            'src/mixable.coffee'

            'src/mixins/dynamic_properties.coffee'
            'src/collection.coffee'
            'src/mixins/collectable.coffee'
            'src/mixins/relations.coffee'
            'src/mixins/storage.coffee'
            'src/mixins/history.coffee'
            'src/mixins/debug.coffee'

            'src/model.coffee'
            'src/template.coffee'
            'src/view.coffee'

            'src/export.coffee'
          ]

      spec:
        files: [
          expand: true
          cwd: 'spec'
          src: ['**/*.coffee']
          dest: '.grunt/tails/spec_compiled'
          ext: '.js'
        ]

    concat:
      banner:
        options:
          banner: '<%= meta.banner %>'
        files:
          'dist/tails.js': 'dist/tails.js'

    uglify:
      dist:
        options:
          banner: '<%= meta.banner %>'
          report: 'gzip'
        files:
          'dist/tails.min.js': 'dist/tails.js'

    jasmine:
      all:
        src: ['dist/tails.js']
        options:
          specs: '.grunt/tails/spec_compiled/**/*.js'
          vendor: [
            'bower_components/underscore/underscore.js'
            'bower_components/inflection/lib/inflection.js'
            'bower_components/q/q.js'
            'bower_components/jquery/jquery.js'
            'bower_components/backbone/backbone.js'
            'bower_components/backbone-deferred/backbone-deferred-q.js'
            'bower_components/rivets/dist/rivets.js'
            'bower_components/jasmine-ajax/lib/mock-ajax.js'
          ]
          template: require('grunt-template-jasmine-istanbul')
          templateOptions:
            coverage: 'bin/coverage/coverage.json'
            report:
              type: 'lcovonly'
              options:
                dir: '.grunt/tails/coverage/lcov'
            thresholds:
              lines: 60
              statements: 60
              branches: 60
              functions: 60


    clean:
      spec: ['spec_compiled']

    watch:
      all:
        files: 'src/**/*.coffee'
        tasks: ['build', 'spec']

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-requirejs'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-jasmine'
  grunt.loadNpmTasks 'grunt-contrib-watch'

  grunt.registerTask 'default', ['watch']
  grunt.registerTask 'spec',  ['clean:spec', 'coffee:dist', 'coffee:spec', 'jasmine', 'clean:spec']
  grunt.registerTask 'build',   ['coffee:dist', 'uglify:dist']

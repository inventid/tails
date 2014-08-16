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
          sourceMap: true
        files:
          'dist/tails-only.js': [
            'src/tails.coffee'
            'src/utils/hash.coffee'
            'src/mixins/interceptable.coffee'
            'src/mixins/debug.coffee'
            'src/mixable.coffee'

            'src/mixins/dynamic_attributes.coffee'
            'src/collection.coffee'
            'src/mixins/collectable.coffee'
            'src/associations/relation.coffee'
            'src/associations/belongs_to_relation.coffee'
            'src/associations/has_one_relation.coffee'
            'src/associations/has_many_relation.coffee'
            'src/associations/association.coffee'
            'src/mixins/associable.coffee'
            'src/mixins/storage.coffee'
            'src/mixins/history.coffee'

            'src/model.coffee'
            'src/template.coffee'
            'src/view.coffee'

            'src/export.coffee'
          ]
      src:
        options:
          join: false
          sourceMap: true
        files: [
          expand: true
          cwd: 'src'
          src: ['**/*.coffee']
          dest: '.grunt/tails/src_compiled'
          ext: '.js'
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
      bundle:
        options:
          banner: '<%= meta.banner %>'
          sourceMap: true
        files:
          'dist/tails-bundle.js': [
            'bower_components/underscore/underscore.js'
            'bower_components/inflection/lib/inflection.js'
            'bower_components/q/q.js'
            'bower_components/jquery/jquery.js'
            'bower_components/backbone/backbone.js'
            'bower_components/backbone-deferred/backbone-deferred-q.js'
            'bower_components/rivets/dist/rivets.js'
            'dist/tails-only.js'
          ]

    uglify:
      dist:
        options:
          banner: '<%= meta.banner %>'
          report: 'gzip'
        files:
          'dist/tails-only.min.js': 'dist/tails-only.js'
      bundle:
        options:
          banner: '<%= meta.banner %>'
          report: 'gzip'
        files:
          'dist/tails-bundle.min.js': 'dist/tails-bundle.js'

    jasmine:
      dist:
        src: ['dist/tails-only.js']
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
          # template: require('grunt-template-jasmine-istanbul')
          # templateOptions:
          #   coverage: 'bin/coverage/coverage.json'
          #   report:
          #     type: 'lcovonly'
          #     options:
          #       dir: '.grunt/tails/coverage/lcov'
          #   thresholds:
          #     lines: 60
          #     statements: 60
          #     branches: 60
          #     functions: 60
      html:
        src: ['dist/tails-only.js']
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
              type: 'html'
              options:
                dir: '.grunt/tails/coverage/html'
            thresholds:
              lines: 60
              statements: 60
              branches: 60
              functions: 60

    plato:
      all:
        options:
          jshint: false
        files:
          'bin/complexity' : ['.grunt/tails/src_compiled/**/*.js']


    clean:
      dist: ['dist']
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
  grunt.loadNpmTasks 'grunt-plato'

  grunt.registerTask 'default', ['watch']
  grunt.registerTask 'spec',  ['clean:spec', 'coffee:dist', 'coffee:spec', 'jasmine:dist', 'clean:spec']
  grunt.registerTask 'build',   ['coffee:dist', 'uglify:dist']
  grunt.registerTask 'bundle',   ['coffee:dist', 'concat:bundle', 'uglify:bundle']
  grunt.registerTask 'analyse',   ['coffee','jasmine:html', 'plato']

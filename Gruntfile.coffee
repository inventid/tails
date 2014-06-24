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

            'src/mixins/interceptable.coffee'
            'src/mixins/dynamic_properties.coffee'
            'src/mixins/collectable.coffee'
            'src/mixins/relations.coffee'

            'src/mixable.coffee'
            'src/model.coffee'
            'src/collection.coffee'
            'src/template.coffee'
            'src/view.coffee'

            'src/export.coffee'
          ]

      spec:
        files: [
          expand: true
          cwd: 'spec'
          src: ['**/*.coffee']
          dest: 'spec_compiled'
          ext: '.js'
        ]

    concat:
      deps:
        src: [
          'bower_components/underscore/underscore.js'
          'bower_components/inflection/lib/inflection.js'
          'bower_components/q/q.js'
          'bower_components/jquery/jquery.js'
          'bower_components/backbone/backbone.js'
          'bower_components/backbone-deferred/backbone-deferred-q.js'
          'bower_components/rivets/dist/rivets.js'
          ]
        dest: 'dist/tails-deps.js'

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
        src: ['dist/tails-deps.js', 'dist/tails.js']
        options:
          specs: 'spec_compiled/**/*.js'

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
  grunt.registerTask 'spec',  ['coffee:dist', 'coffee:spec', 'concat:deps', 'jasmine', 'clean:spec']
  grunt.registerTask 'build',   ['coffee:dist', 'uglify:dist']

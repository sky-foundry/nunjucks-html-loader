const utils = require('loader-utils')
const fs = require('fs')
const path = require('path')
const nunjucks = require('nunjucks')
const i18n = require('i18n')

const NunjucksLoader = nunjucks.Loader.extend({
  // Based off of the Nunjucks 'FileSystemLoader'

  init: function(searchPaths, sourceFoundCallback) {
    this.sourceFoundCallback = sourceFoundCallback
    if (searchPaths) {
      searchPaths = Array.isArray(searchPaths) ? searchPaths : [searchPaths]
      // For windows, convert to forward slashes
      this.searchPaths = searchPaths.map(path.normalize)
    } else {
      this.searchPaths = ['.']
    }
  },

  getSource: function(name) {
    let fullpath = null
    const paths = this.searchPaths

    for (var i = 0; i < paths.length; i++) {
      const basePath = path.resolve(paths[i])
      const p = path.resolve(paths[i], name)

      // Only allow the current directory and anything
      // underneath it to be searched
      if (p.indexOf(basePath) === 0 && fs.existsSync(p)) {
        fullpath = p
        break
      }
    }

    if (!fullpath) {
      return null
    }

    this.sourceFoundCallback(fullpath)

    return {
      src: fs.readFileSync(fullpath, 'utf-8'),
      path: fullpath,
      noCache: this.noCache,
    }
  },
})

module.exports = function(content) {
  this.cacheable()

  const currentRequest = utils.getCurrentRequest(this)
  const currentLocale = currentRequest.substr(currentRequest.length - 6, 2)

  const callback = this.async()
  const opt = utils.getOptions(this) || {}

  const nunjucksSearchPaths = opt.searchPaths
  const nunjucksContext = opt.context
  const config = opt.configure || {}
  const configureEnvironment = opt.configureEnvironment || function(env) {}
  const i18nOptions = opt.i18n

  const loader = new NunjucksLoader(
    nunjucksSearchPaths,
    function(path) {
      this.addDependency(path)
    }.bind(this)
  )

  const nunjEnv = new nunjucks.Environment(loader, config)

  if (i18nOptions) {
    i18n.configure({ ...i18nOptions, defaultLocale: currentLocale })
    nunjEnv.addGlobal(
      '__',
      !i18nOptions.transformFunc
        ? i18n.__
        : function(key) {
            let result = i18n.__(...arguments)
            return i18nOptions.transformFunc(key, result)
          }
    )
  }

  configureEnvironment(nunjEnv)

  const template = nunjucks.compile(content, nunjEnv)
  const html = template.render(nunjucksContext)

  callback(null, html)
}

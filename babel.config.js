module.exports = function(api) {
    api.cache(true)
  
    const presets = [
      [
        '@babel/preset-env',
        {
          modules: false
        }
      ],
      '@babel/preset-react',
      '@babel/preset-typescript'
    ]
    const plugins = [[
        "import",{
            "libraryName":"antd",
            "libraryDirectory":"es",
            "style":"css"
        }]
    ]
  
    return {
      presets,
      plugins
    }
  }
 
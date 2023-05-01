module.exports = {
  packagerConfig: {
    icon: './src/icons/icon',
    name: 'echo-search'
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin']
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          icon: './src/icons/icon.png',
        }
      }
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-webpack',
      config: {
        mainConfig: './webpack.main.config.js',
        devContentSecurityPolicy: "connect-src 'self' 'unsafe-eval' https://api.github.com",
        renderer: {
          config: './webpack.renderer.config.js',
          entryPoints: [
            {
              html: './src/Client/index.html',
              js: './src/Client/renderer.js',
              name: 'main_window',
              preload: {
                js: './src/preload.js',
              },
            },
          ],
        },
      },
    },
  ],
};

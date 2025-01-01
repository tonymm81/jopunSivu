module.exports = { apps: [ { name: 'Jopun sivu', script: './dist/index.js', cwd: 
    './', watch: true, env: { NODE_ENV: 'development', }, 
    env_production: { NODE_ENV: 'production', 
    }, }, ], };
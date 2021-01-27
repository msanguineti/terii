const rollup = require('rollup');
const uglify = require('rollup-plugin-uglify-es');

/**
* Bundle the JavaScript components together and smoosh them with uglify
*/
async function bundleJavaScript() {
    const bundle = await rollup.rollup({
        input: `${__dirname}/src/terii.js`,
        plugins: [
            uglify()
        ]
    });

    await bundle.write({
        format: 'umd',
        name: 'terii',
        file: 'terii.umd.js',
        dir: `${__dirname}/dist/`,
    });

    await bundle.write({
        format: 'esm',
        name: 'terii',
        file: 'terii.js',
        dir: `${__dirname}/dist/`,
    });
};

bundleJavaScript();

module.exports = {
    head: [
        ['link', { rel: 'icon', href: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/174183/terii-favicon.png' }]
    ],
    themeConfig: {
        title: 'Terii',
        nav: [
            {
                text: 'Home',
                link: '/'
            },
            {
                text: 'GitHub',
                link: 'https://github.com/hankchizljaw/terii'
            },
            {
                text: 'npm',
                link: 'https://www.npmjs.com/package/terii'
            }
        ],
        sidebar: [
            {
                title: 'Quick links',
                collapsable: false,
                children: [
                    '/'
                ]
            },
            {
                title: 'Guide',
                collapsable: false,
                children: [
                    '/guide/state.html',
                    '/guide/actions.html',
                    '/guide/mutations.html'
                ]
            },
            {
                title: 'Reference',
                collapsable: false,
                children: [
                    '/reference/store-class.html'
                ]
            }
        ],
        displayAllHeaders: true
    }
};

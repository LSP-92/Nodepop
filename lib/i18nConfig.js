'use strict'

const path = require('path')
const i18n = require('i18n')


i18n.configure({
    locales: ['es', 'en'],
    directory: path.join(__dirname, '../locales'),
    defaultLocale: 'en',
    autoReload: true,
    syncFiles: true,
    cookie: 'language-locale'
})

i18n.setLocale('en')

module.exports = i18n
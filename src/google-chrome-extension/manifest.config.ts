import { defineManifest } from '@crxjs/vite-plugin'
import { MOODLE_ORIGIN } from './src/config'
import { WEBSOCKET_HOST } from '../shared/config/connection'
import { translations } from '../shared/translations/translations'
import packageJson from './package.json'

export default defineManifest({
  manifest_version: 3,
  name: translations.extension.name,
  description: translations.extension.description,
  version: packageJson.version,
  key: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuMxJVpM89viad112VY/JLPW4+o3arwQvoHOBSQZrmw9zr9ARB62e5HojjWn3HnbOcWSN/ltr/1idZDX2fxNbHmRJsctUl1PZ0Q35ucfVIhVcWjln9O0YDbXUbd8/jZXHIreP4uAOcjhPZUItfSFQFVFxr5BwHzHtj10liDq2TkL2NYXg6mXzHOkk9sCWq7kogZRLirVcfFWibK2IUPId6LdzzlnFcVcldAH9M0pSLmSPrXq5Za5SnHCNxL8y+CafHsXGVIB4sVGfouAt+wokcco3g28/qRxGsL+fh9KAuKfqcVJZ+GlgV6gyqFhnBOC+MV+6opSUczy7m9y+snIu0QIDAQAB',
  icons: {
    16: 'images/128.png',
    128: 'images/128.png',
  },
  action: {
    default_popup: 'src/popup/popup.html',
    default_title: translations.extension.name,
  },
  background: {
    service_worker: 'src/service-worker/service-worker.ts',
    type: 'module',
  },
  content_scripts: [
    {
      matches: [`${MOODLE_ORIGIN}/mod/assign/*action=grader*`],
      js: ['src/content-script/assign-grader.ts'],
      css: ['src/shared/styles/theme.css', 'src/content-script/assign-grader.css'],
    },
    {
      matches: [`${MOODLE_ORIGIN}/mod/quiz/review.php*`],
      js: ['src/content-script/quiz-review.ts'],
      css: ['src/shared/styles/theme.css', 'src/content-script/quiz-review.css'],
    },
    {
      matches: [`${MOODLE_ORIGIN}/mod/quiz/comment.php*`],
      js: ['src/content-script/quiz-comment.ts'],
    },
  ],
  web_accessible_resources: [
    {
      resources: ['images/*'],
      matches: ['<all_urls>'],
    },
  ],
  permissions: [
    'storage',
    'activeTab',
  ],
  host_permissions: [
    // Match patterns don't contain a port, so this covers the WebSocket port as well.
    `ws://${WEBSOCKET_HOST}/*`,
  ],
})

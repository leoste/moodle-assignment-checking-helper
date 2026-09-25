import { defineManifest } from '@crxjs/vite-plugin'
import { MOODLE_ORIGIN } from './src/config'
import { WEBSOCKET_HOST } from '../shared/config/connection'

export default defineManifest({
  manifest_version: 3,
  name: 'Moodle Assignment Checking Helper',
  description: 'Speeds up checking assignments on Moodle by reducing clicks and typing.',
  version: '0.1',
  icons: {
    16: 'images/128.png',
    128: 'images/128.png',
  },
  action: {
    default_popup: 'src/popup/popup.html',
    default_title: 'Moodle Assignment Checking Helper',
  },
  background: {
    service_worker: 'src/service-worker/service-worker.ts',
    type: 'module',
  },
  content_scripts: [
    {
      matches: [`${MOODLE_ORIGIN}/mod/assign/*action=grader*`],
      js: ['src/content-script/assign-grader.ts'],
      css: ['src/content-script/assign-grader.css'],
    },
    {
      matches: [`${MOODLE_ORIGIN}/mod/quiz/review.php*`],
      js: ['src/content-script/quiz-review.ts'],
      css: ['src/content-script/quiz-review.css'],
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

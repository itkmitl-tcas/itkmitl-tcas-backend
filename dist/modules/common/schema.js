'use strict';
// import connectionStr from '../../config/connection';
Object.defineProperty(exports, '__esModule', { value: true });
exports.dropMessagesTable = exports.insertMessages = exports.createMessageTable = void 0;
exports.createMessageTable = `
DROP TABLE IF EXISTS messages;
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR DEFAULT '',
  message VARCHAR NOT NULL
  )
  `;
exports.insertMessages = `
INSERT INTO messages(name, message)
VALUES ('chidimo', 'first message'),
      ('orji', 'second message')
`;
exports.dropMessagesTable = 'DROP TABLE messages';
//# sourceMappingURL=schema.js.map

// ICMA Lab 機器人問答紀錄：貼到 Google Sheet 的「擴充功能 → Apps Script」
// 1. 把下面 SECRET 換成你自己的一串亂碼（之後同一串也要貼到 Netlify）
const SECRET = '換成你自己的一串亂碼';

function doPost(e) {
  let d;
  try { d = JSON.parse(e.postData.contents); } catch (_) { return out('bad request'); }
  if (!d || d.secret !== SECRET) return out('forbidden');

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName('問答紀錄') || ss.insertSheet('問答紀錄');
  if (sh.getLastRow() === 0) {
    sh.appendRow(['時間', '問題', '回答', '狀態']);
    sh.setFrozenRows(1);
  }
  // 開頭是 = + - @ 的文字前面加 '，避免被當成公式
  const safe = v => { v = String(v || '').slice(0, 2000); return /^[=+\-@]/.test(v) ? "'" + v : v; };
  sh.appendRow([new Date(), safe(d.question), safe(d.answer), safe(d.status)]);
  return out('ok');
}

function out(t) { return ContentService.createTextOutput(t); }

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const nav = fs.readFileSync(path.join(__dirname, '../../source/js/modules/nav.js'), 'utf8');
const welcome = nav.slice(nav.indexOf('/* 欢迎信息 start */'), nav.indexOf('/* 欢迎信息 end */'));

function fixture(hour, hasCard = true) {
  let card = hasCard ? { innerHTML: '' } : null;
  const listeners = { document: new Map(), window: new Map() };
  const originalOnload = () => {};
  const context = {
    Date: class extends Date {
      getHours() { return hour; }
      getMinutes() { return 7; }
    },
    document: {
      getElementById: id => id === 'welcome-info' ? card : null,
      addEventListener: (type, fn) => listeners.document.set(type, fn)
    },
    window: {
      onload: originalOnload,
      addEventListener: (type, fn) => listeners.window.set(type, fn)
    }
  };
  // No location data, jQuery, fetch or timers: greeting must work without a network.
  vm.runInNewContext(welcome, context);
  return {
    context, originalOnload,
    get card() { return card; },
    replaceCard() { card = { innerHTML: '' }; },
    emit(target, type) { listeners[target].get(type)(); }
  };
}

for (const [hour, greeting] of [[0, '夜深了'], [4, '夜深了'], [5, '上午好'], [10, '上午好'],
  [11, '中午好'], [12, '中午好'], [13, '下午好'], [17, '下午好'], [18, '晚上好'], [23, '晚上好']]) {
  test(`offline welcome at ${hour}:07`, () => {
    const f = fixture(hour);
    assert.match(f.card.innerHTML, new RegExp(greeting));
    assert.match(f.card.innerHTML, new RegExp(String(hour).padStart(2, '0') + ':07'));
    assert.match(f.card.innerHTML, /ethan_xie/);
    assert.doesNotMatch(f.card.innerHTML, /加载|公里|IP地址/);
  });
}

test('PJAX replaces the welcome card and renders the new node', () => {
  const f = fixture(14);
  const old = f.card;
  f.replaceCard();
  f.emit('document', 'pjax:complete');
  assert.match(f.card.innerHTML, /下午好/);
  assert.notEqual(f.card, old);
});

test('pages without a card are safe and subsequent navigation recovers', () => {
  const f = fixture(8, false);
  f.emit('document', 'DOMContentLoaded');
  f.emit('window', 'load');
  assert.equal(f.context.window.onload, f.originalOnload);
  f.replaceCard();
  f.emit('document', 'pjax:complete');
  assert.match(f.card.innerHTML, /上午好/);
});

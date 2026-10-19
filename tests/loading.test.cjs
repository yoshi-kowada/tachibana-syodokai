const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const code = fs.readFileSync('main.js', 'utf8');
function run({stored = false, storageFails = false, rejected = false} = {}) {
  const listeners = {}, events = {}, timers = new Map(); let seq = 0;
  const classes = new Set(['is-loading']);
  const loader = {hidden:false, classList:{add:()=>{}},style:{}};
  const video = {hidden:false,paused:true,readyState:0,pause(){this.paused=true},play(){this.paused=false;return rejected ? Promise.reject(new Error('autoplay blocked')) : Promise.resolve()},addEventListener(name,fn){events[name]=fn}};
  const fallback = {hidden:true};
  const doc = {documentElement:{classList:{add:c=>classes.add(c),remove:c=>classes.delete(c)}},getElementById:id=>({'loader':loader,'loader-video':video,'loader-fallback':fallback}[id]),addEventListener(n,fn){(listeners[n]??=[]).push(fn)}};
  vm.runInNewContext(code,{document:doc,sessionStorage:{getItem(){if(storageFails)throw Error();return stored?'true':null},setItem(){if(storageFails)throw Error()}},setTimeout(fn,ms){timers.set(++seq,{fn,ms});return seq},clearTimeout(id){timers.delete(id)}});
  listeners.DOMContentLoaded.forEach(f=>f());
  return {loader,video,fallback,classes,timers,events,fire(ms){const t=[...timers].find(([,t])=>t.ms===ms);assert.ok(t,`Missing ${ms}ms timer`);timers.delete(t[0]);t[1].fn()}};
}
(async()=>{
  const normal=run(); normal.events.playing(); normal.fire(3500);assert.ok(normal.classes.has('is-loading'),'content must stay hidden during fade');normal.fire(500);assert.equal(normal.loader.hidden,true);assert.equal(normal.classes.has('is-loading'),false);assert.equal(normal.video.playsInline,true);assert.equal(normal.video.defaultMuted,true);
  const repeat=run({stored:true});assert.equal(repeat.loader.hidden,true);assert.equal(repeat.classes.has('is-loading'),false);
  const blockedStorage=run({storageFails:true});blockedStorage.events.playing();blockedStorage.fire(3500);blockedStorage.fire(500);assert.equal(blockedStorage.classes.has('is-loading'),false);
  const denied=run({rejected:true});await Promise.resolve();assert.equal(denied.fallback.hidden,false);denied.fire(3500);denied.fire(500);assert.equal(denied.loader.hidden,true);
  const stalled=run();stalled.fire(15000);stalled.fire(500);assert.equal(stalled.classes.has('is-loading'),false);
  console.log('PASS: inline muted playback, fade isolation, repeat visit, blocked storage, autoplay fallback, timeout');
})();

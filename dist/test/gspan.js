"use strict";

var _expect = require("expect.js");

var _expect2 = _interopRequireDefault(_expect);

var _index = require("../index");

var _index2 = _interopRequireDefault(_index);

var _isLive = require("../utils/isLive");

var _isLive2 = _interopRequireDefault(_isLive);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const TEST_DOC = '1uD3QH9TJTUbmD76c3ELRgfWDszY68NgwovF3iUf3RvE';
describe('GSpan', () => {
  let content, live, users;
  before(async function () {
    const transcript = await (0, _index2.default)(TEST_DOC, null, {
      authorAPI: 'https://politicoapps.com/staff/api/staffer/',
      authorNameAccessor: 'profile.google_display_name',
      authorIdAccessor: 'username'
    });
    content = transcript.content;
    live = transcript.live;
    users = transcript.users; // console.log(transcript);
    // console.log(transcript.content[1].annotations[0]);
    // content.forEach((v, i) => console.log(i, v));
  });
  it('Loads the Google Doc', () => {
    (0, _expect2.default)(content).to.be.an('array');
  });
  it('Parses the doc into elements', () => {
    (0, _expect2.default)(live).to.be(false);
    (0, _expect2.default)(content.length).to.be(16);
    (0, _expect2.default)(users).to.be.an('object');
    (0, _expect2.default)(users).to.have.property('abriz@politico.com');
  });
  it('Includes attributions, content, and soundbites', () => {
    const attributions = content.filter(b => b.type === 'attribution');
    (0, _expect2.default)(attributions.length).to.be.above(0);
    const contents = content.filter(b => b.type === 'content');
    (0, _expect2.default)(contents.length).to.be.above(0);
    const soundbites = content.filter(b => b.type === 'soundbite');
    (0, _expect2.default)(soundbites.length).to.be.above(0);
  });
  it('Only includes attribution blocks on attribution changes', () => {
    const attributions = content.filter(b => b.type === 'attribution');
    (0, _expect2.default)(attributions.length).to.be(4);
  });
  it('Includes annotations with all the proper data', () => {
    content.forEach(b => {
      b.annotations.forEach(a => {
        (0, _expect2.default)(a).to.be.an('object');
        (0, _expect2.default)(a).to.have.property('id');
        (0, _expect2.default)(a.id).to.be.a('string');
        (0, _expect2.default)(a).to.have.property('text');
        (0, _expect2.default)(a.text).to.be.a('string');
        (0, _expect2.default)(a).to.have.property('tags');
        (0, _expect2.default)(a.tags).to.be.an('object');
        (0, _expect2.default)(a).to.have.property('published');
        (0, _expect2.default)(a.published).to.be.a('boolean');
        (0, _expect2.default)(a).to.have.property('location');
        (0, _expect2.default)(a.location).to.be.an('array');
        (0, _expect2.default)(a.location[0]).to.be.greaterThan(-1);
        (0, _expect2.default)(a).to.have.property('author');
        (0, _expect2.default)(a.author).to.be.a('string');
      });
    });
  });
  it('Matches annotations with the right content', () => {
    const graf = content[1];
    (0, _expect2.default)(graf.annotations.length).to.be.above(0);
    const annotation = graf.annotations[0];
    (0, _expect2.default)(graf.value.substring(...annotation.location)).to.be('Lorem ipsum dolor sit amet, consectetur adipisicing elit, ' + 'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.');
  });
  it('Matches annotations with override content', () => {
    const graf = content[4];
    (0, _expect2.default)(graf.annotations.length).to.be.above(0);
    const annotationOne = graf.annotations[0];
    (0, _expect2.default)(graf.value.substring(...annotationOne.location)).to.be('Sed leo mauris, posuere vitae ante id, malesuada mattis justo. ' + 'Interdum et malesuada fames ac ante ipsum primis in faucibus.');
    const annotationTwo = graf.annotations[1];
    (0, _expect2.default)(graf.value.substring(...annotationTwo.location)).to.be('dolor');
    const annotationThree = graf.annotations[2];
    (0, _expect2.default)(graf.value.substring(...annotationThree.location)).to.be('at semper risus.');
  });
  it('Matches annotations of long content', () => {
    const grafOne = content[9];
    (0, _expect2.default)(grafOne.annotations.length).to.be.above(0);
    const annotationOne = grafOne.annotations[0];
    (0, _expect2.default)(grafOne.value.substring(...annotationOne.location)).to.be('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae ' + 'ultricies urna, eget posuere velit. Aliquam sagittis id orci et ' + 'mattis. In ut metus vel massa molestie pharetra a id odio. Fusce in ' + 'ligula faucibus justo condimentum aliquet. Donec sagittis odio ac ' + 'eros posuere blandit. Phasellus iaculis placerat velit ac porttitor. ' + 'Nam vulputate tortor nec mi fermentum, at tincidunt magna rhoncus. Sed ' + 'magna quam, egestas et ornare quis, blandit quis ante. Donec massa ' + 'odio, interdum quis odio eu, consequat maximus libero. Pellentesque ' + 'ultricies vehicula diam, quis elementum ligula sodales quis. Aenean ' + 'iaculis orci sed nisi aliquam, sit amet imperdiet leo aliquam. Donec ' + 'pharetra suscipit tellus quis eleifend.');
    const grafTwo = content[10];
    (0, _expect2.default)(grafTwo.annotations.length).to.be.above(0);
    const annotationTwo = grafTwo.annotations[0];
    (0, _expect2.default)(grafTwo.value.substring(...annotationTwo.location)).to.be('In at feugiat tortor. Quisque lacinia sapien nulla. Donec vitae ' + 'congue lectus. Fusce pharetra odio eget risus consequat, consequat ' + 'molestie elit mattis. Aenean ut nulla mattis lorem ornare ' + 'scelerisque. Vestibulum eu tortor at tortor facilisis porttitor a ' + 'quis est. Donec et libero non lectus congue accumsan. Donec sed ' + 'ligula vel ante tristique ultrices. Sed cursus venenatis leo, et ' + 'ultrices diam porttitor vitae. Aliquam non blandit eros. Nulla ' + 'facilisi. Class aptent taciti sociosqu ad litora torquent per ' + 'conubia nostra, per inceptos himenaeos.');
  });
  it('Handles annotations that span multiple paragraphs', () => {
    const graf = content[7];
    (0, _expect2.default)(graf.annotations.length).to.be.above(0);
    const annotation = graf.annotations[0];
    (0, _expect2.default)(graf.value.substring(...annotation.location)).to.be('Maecenas turpis arcu, pulvinar id fringilla ut, posuere sed metus.');
  });
  it('Handles escaped square brackets', () => {
    const graf = content[11];
    (0, _expect2.default)(graf.annotations.length).to.be(1);
    (0, _expect2.default)(graf.value).to.be('Duis [ac] elit ut massa [vehicula] condimentum.');
  });
  it('Ignores annotations for empty paragraphs', () => {
    content.forEach(b => {
      b.annotations.forEach(a => {
        (0, _expect2.default)(a.text).to.not.be('Empty graf comment');
      });
    });
  });
  it('Parses annotation keys', () => {
    const graf = content[1];
    (0, _expect2.default)(graf.annotations.length).to.be.above(0);
    const annotaion = graf.annotations[0];
    (0, _expect2.default)(annotaion.tags).to.have.property('key');
    (0, _expect2.default)(annotaion.tags.key).to.be('value');
    (0, _expect2.default)(annotaion.tags).to.have.property('key2');
    (0, _expect2.default)(annotaion.tags.key2).to.be('value2');
    (0, _expect2.default)(annotaion.tags).to.have.property('key3');
    (0, _expect2.default)(annotaion.tags.key3).to.be('value3');
    (0, _expect2.default)(annotaion.tags).to.have.property('key4');
    (0, _expect2.default)(annotaion.tags.key4).to.be('');
    (0, _expect2.default)(annotaion.tags).to.have.property('key_underscore');
    (0, _expect2.default)(annotaion.tags['key_underscore']).to.be('value');
    (0, _expect2.default)(annotaion.tags).to.have.property('key-dash');
    (0, _expect2.default)(annotaion.tags['key-dash']).to.be('value');
    (0, _expect2.default)(annotaion.tags).to.not.have.property('bad key');
    (0, _expect2.default)(annotaion.tags).to.have.property('markdown');
    (0, _expect2.default)(annotaion.tags.markdown).to.be('**test** hello *test*');
    (0, _expect2.default)(annotaion.tags).to.have.property('link');
    (0, _expect2.default)(annotaion.tags.link).to.be('[My Link](https://example.com)');
    (0, _expect2.default)(annotaion.tags).to.have.property('paragraph');
    (0, _expect2.default)(annotaion.tags.paragraph).to.be('Lorem ipsum.\n\nQuisque ex turpis, sollicitudin et.');
  });
  it('Handles annotation publish status', () => {
    const grafOne = content[1];
    (0, _expect2.default)(grafOne.annotations.length).to.be.above(0);
    const annotationOne = grafOne.annotations[0];
    (0, _expect2.default)(annotationOne.published).to.be(true);
    const annotationTwo = grafOne.annotations[1];
    (0, _expect2.default)(annotationTwo.published).to.be(false);
    const grafTwo = content[3];
    (0, _expect2.default)(grafTwo.annotations.length).to.be.above(0);
    const annotationThree = grafTwo.annotations[0];
    (0, _expect2.default)(annotationThree.published).to.be(false);
  });
  it('Handles annotation user matching', () => {
    const graf = content[1];
    (0, _expect2.default)(graf.annotations.length).to.be.above(0);
    const annotation = graf.annotations[0];
    (0, _expect2.default)(users[annotation.author].last_name).to.be('Briz');
  });
  it('Parses annotation text with Marker', () => {
    const graf = content[9];
    (0, _expect2.default)(graf.annotations.length).to.be.above(0);
    const annotation = graf.annotations[0];
    (0, _expect2.default)(annotation.text).to.be('Comment about something **long**.');
  });
  it('Creates unique IDs', () => {
    content.forEach(g => {
      const contentWithId = content.filter(c => c.id === g.id);
      (0, _expect2.default)(contentWithId.length).to.be(1);
    });
  });
  it('Creates consistent IDs', async function () {
    const transcriptTwo = await (0, _index2.default)(TEST_DOC, null, {
      authorAPI: 'https://politicoapps.com/staff/api/staffer/',
      authorNameAccessor: 'profile.google_display_name',
      authorIdAccessor: 'username'
    });
    content.forEach((g, idx) => {
      (0, _expect2.default)(g.id).to.be(transcriptTwo.content[idx].id);
    });
  });
  it('Parses different "live" states', () => {
    (0, _expect2.default)((0, _isLive2.default)(`
      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
      sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      ^^^^^^^^^^ DO NOT WRITE BELOW THIS LINE ^^^^^^^^^^
      `)).to.be(true);
    (0, _expect2.default)((0, _isLive2.default)(`
      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
      sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      -------> LIVE TRANSCRIPT HAS ENDED <-----------
      `)).to.be(false);
    (0, _expect2.default)((0, _isLive2.default)(`
      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
      sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      `)).to.be(false);
  });
});
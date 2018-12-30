'use strict';

const fs = require('fs');

const TAB = '    ';
const NL = '\r\n';

let _path = __dirname+"/";

function path(value){
  _path = __dirname+""+value+"/";
}



function nav(links) {
  var wstream = fs.createWriteStream(_path+"nav.jade");
  wstream.write('nav' + NL);
  wstream.write(TAB+  '.nav-wrapper.black'+ NL);
  wstream.write(TAB+  TAB+  'a.sidenav-trigger.show-on-large(href=\'#!\', data-target=\'mobile-demo\')'+ NL);
  wstream.write(TAB+  TAB+  TAB+  'i.material-icons menu'+ NL);
  wstream.write(TAB+  TAB+  'a.brand-logo(href=\'#!\') express-postgres'+ NL);
  wstream.write(TAB+  TAB+  'ul#mobile-demo.sidenav'+ NL);
  for (let i = 0; i < links.length; i++) {
    wstream.write(TAB+  TAB+  TAB+  'li'+ NL);
    wstream.write(TAB+  TAB+  TAB+  TAB+  'a(href=\''+ links[i]+'/\', target=\'_blank\') ' + links[i]+ NL);
  }
  wstream.write('script(type=\'text/javascript\', src=\'/js/materialize.js\')' + NL);
  wstream.write('script(type=\'text/javascript\').' + NL);
  wstream.write(TAB+  'let sidenavs = document.querySelectorAll(\'.sidenav\');'+ NL);
  wstream.write(TAB+  'for (let i = 0; i < sidenavs.length; i++){'+ NL);
  wstream.write(TAB+  TAB+  'M.Sidenav.init(sidenavs[i]);'+ NL);
  wstream.write(TAB+  '}'+ NL);
  wstream.end();
}

function pages(tables) {

  for (let i = 0; i < tables.length; i++) {
    edit(tables[i]);
    show(tables[i]);
  }

}

function edit(table) {
  var wstream = fs.createWriteStream(_path+table.name+"-edit.jade");
  wstream.write('doctype html' + NL);
  wstream.write('html' + NL);
  wstream.write(TAB+  'head' + NL);
  wstream.write(TAB+  TAB+  'link(href=\'https://fonts.googleapis.com/icon?family=Material+Icons\', rel=\'stylesheet\')' + NL);
  wstream.write(TAB+  TAB+  'link(type=\'text/css\', rel=\'stylesheet\', href=\'/css/materialize.css\', media=\'screen,projection\')' +NL);
  wstream.write(TAB+  TAB+  'meta(name=\'viewport\', content=\'width=device-width, initial-scale=1.0\')' + NL);
  wstream.write(TAB+  'body' + NL);
  wstream.write(TAB+  TAB+  'include ./nav.jade' + NL);
  wstream.write(TAB+  TAB+  '.container.center-align' + NL);
  wstream.write(TAB+  TAB+  TAB+  '- var _action = \'./\';' + NL);
  wstream.write(TAB+  TAB+  TAB+  '- if ('+table.name+'.length > 0){' + NL);
  wstream.write(TAB+  TAB+  TAB+  TAB+  '- _action = \'./upd/\'+'+table.name+'[0]["'+table.primary_key+'"];' + NL);
  wstream.write(TAB+  TAB+  TAB+  TAB+  'h4 Edit '+table.name + NL);
  wstream.write(TAB+  TAB+  TAB+  '- }else{' + NL);
  let push = '';
  for (let i = 0; i < table.columns.length; i++) {
    push +='"'+table.columns[i]+'":null';
    if(i+1 < table.columns.length) {
      push+=",";
    }
  }
  wstream.write(TAB+  TAB+  TAB+  TAB+  '- '+table.name+'.push({' + push +'});'+ NL);
  wstream.write(TAB+  TAB+  TAB+  TAB+  'h4  New '+table.name+ NL);
  wstream.write(TAB+  TAB+  TAB+  '- }'+ NL);
  wstream.write(TAB+  TAB+  '.container' + NL);
  wstream.write(TAB+  TAB+  TAB+  'form(name=\'form\', method= \'POST\', action = _action)' + NL);
  
  for (let i = 0; i < table.columns.length; i++) {
    wstream.write(TAB+  TAB+  TAB+  TAB+  '.row' + NL);
    wstream.write(TAB+  TAB+  TAB+  TAB+  'label ' + table.columns[i]+ NL);
    wstream.write(TAB+  TAB+  TAB+  TAB+  'input(type=\'text\', name=\''+table.columns[i]+'\', value= '+table.name+'[0]["'+table.columns[i]+'"])'+ NL);
  }
  wstream.write(TAB+  TAB+  TAB+  TAB+  'button.btn.waves-effect.waves-light.black(type=\'submit\', name=\'action\') Save' + NL);
  wstream.write(TAB+  TAB+  TAB+  TAB+  TAB+  'i.material-icons.right send' + NL);

  wstream.write(TAB+  TAB+  TAB+  '- if(_action != \'./\')' + NL);
  wstream.write(TAB+  TAB+  TAB+  TAB+  '.row' + NL);
  wstream.write(TAB+  TAB+  TAB+  TAB+  'form(method=\'GET\', action=\'./del/\'+'+table.name+'[0]["'+table.primary_key+'"])' + NL);
  wstream.write(TAB+  TAB+  TAB+  TAB+  TAB+  'button.btn.waves-effect.waves-light.black(type=\'submit\') Delete' + NL);
  wstream.write(TAB+  TAB+  TAB+  TAB+  TAB+  TAB+  'i.material-icons.right delete' + NL);

}

function show(table) {
  var wstream = fs.createWriteStream(_path+table.name+"-show.jade");
  wstream.write('doctype html' + NL);
  wstream.write('html' + NL);
  wstream.write(TAB+  'head' + NL);
  wstream.write(TAB+  TAB+  'link(href=\'https://fonts.googleapis.com/icon?family=Material+Icons\', rel=\'stylesheet\')' + NL);
  wstream.write(TAB+  TAB+  'link(type=\'text/css\', rel=\'stylesheet\', href=\'/css/materialize.css\', media=\'screen,projection\')' +NL);
  wstream.write(TAB+  TAB+  'meta(name=\'viewport\', content=\'width=device-width, initial-scale=1.0\')' + NL);
  wstream.write(TAB+  'body' + NL);
  wstream.write(TAB+  TAB+  'include ./nav.jade' + NL);
  wstream.write(TAB+  TAB+  '.container.center-align' + NL);
  wstream.write(TAB+  TAB+  TAB+  'h2 '+table.name + NL);
  wstream.write(TAB+  TAB+  '.container' + NL);
  wstream.write(TAB+  TAB+  TAB+  'h5' + NL);
  wstream.write(TAB+  TAB+  TAB+  TAB+  'a(href=\'./0\') + add new' + NL);
  wstream.write(TAB+  TAB+  TAB+  'table' + NL);
  wstream.write(TAB+  TAB+  TAB+  TAB+  'thead' + NL);
  wstream.write(TAB+  TAB+  TAB+  TAB+  TAB+  'tr' + NL);
  for (let i = 0; i < table.columns.length; i++) {
    wstream.write(TAB+  TAB+  TAB+  TAB+  TAB+  TAB+  'th ' + table.columns[i] + NL); 
  }
  wstream.write(TAB+  TAB+  TAB+  TAB+  'tbody' + NL);
  wstream.write(TAB+  TAB+  TAB+  TAB+  TAB+  '- for(let i=0; i < '+table.name+'.length; i++)' + NL);
  wstream.write(TAB+  TAB+  TAB+  TAB+  TAB+  TAB+  'tr' + NL); 
  
  for (let i = 0; i < table.columns.length; i++) {
    wstream.write(TAB+  TAB+  TAB+  TAB+  TAB+  TAB+  TAB+  'td #{' + table.name +'[i][\'' + table.columns[i] + '\']}'+NL); 
  }
  wstream.write(TAB+  TAB+  TAB+  TAB+  TAB+  TAB+  TAB+  'td'+NL); 
  wstream.write(TAB+  TAB+  TAB+  TAB+  TAB+  TAB+  TAB+  TAB+  'a(href = \'./\'+'+ table.name +'[i][\''+table.primary_key+'\']) edit'+NL); 
}


module.exports = {
  nav : nav,
  path : path,
  pages : pages
  
};
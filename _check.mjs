import { parse } from '@babel/parser';
import { readFileSync } from 'fs';
const files = ['Stats','Welcome','Heritage','KeyDatesCalendar','Faculty','ProgramHighlights','Program','Registration','Venue'];
let ok = true;
for (const f of files) {
  try {
    parse(readFileSync(`src/components/${f}.jsx`,'utf8'), { sourceType:'module', plugins:['jsx'] });
    console.log('✅', f);
  } catch(e){ ok=false; console.log('❌', f, '-', e.message); }
}
process.exit(ok?0:1);

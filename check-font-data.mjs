// Prints the subsets next/font believes each CJK Noto font has.
import data from 'next/dist/compiled/@next/font/dist/google/font-data.json' with { type: 'json' }

for (const family of [
  'Noto Serif SC',
  'Noto Sans SC',
  'Noto Serif TC',
  'Noto Sans JP',
  'Noto Sans KR',
  'Noto Sans Osage',
]) {
  console.log(family, '=>', JSON.stringify(data[family]?.subsets))
}

import { sum0 } from '../../lib/heavy-0';
import { sum1 } from '../../lib/heavy-1';
import { sum2 } from '../../lib/heavy-2';
import { sum3 } from '../../lib/heavy-3';
import { sum4 } from '../../lib/heavy-4';
import { sum5 } from '../../lib/heavy-5';
import { sum6 } from '../../lib/heavy-6';
import { sum7 } from '../../lib/heavy-7';
import { sum8 } from '../../lib/heavy-8';
import { sum9 } from '../../lib/heavy-9';
import { sum10 } from '../../lib/heavy-10';
import { sum11 } from '../../lib/heavy-11';

export async function getStaticProps() {
  return { props: { total: sum0 + sum1 + sum2 + sum3 + sum4 + sum5 + sum6 + sum7 + sum8 + sum9 + sum10 + sum11, page: 14 } };
}

export default function Page14({ total, page }) {
  return <main>page {page} — {total}</main>;
}

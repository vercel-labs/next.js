export default {
  name: 'repro-adapter',
  async onBuildComplete({ outputs }) {
    for (const [k, v] of Object.entries(outputs ?? {})) {
      console.log(`[adapter] ${k}:`, JSON.stringify(Array.isArray(v) ? v.map(o => ({p:o.pathname, t:o.type, src:o.sourcePage ?? o.sourceRoute})) : v));
    }
  },
};

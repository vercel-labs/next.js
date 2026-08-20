// Simulates a Temporal workflow package: Temporal resolves workflows by fn.name
export async function myTemporalWorkflow(input) {
  return `ran ${input}`;
}
export const arrowWorkflow = async (input) => `ran ${input}`;

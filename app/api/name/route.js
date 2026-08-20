import { myTemporalWorkflow, arrowWorkflow } from 'workflows';

export const dynamic = 'force-dynamic';

export async function GET() {
  const localFn = async function localWorkflow() {};
  return Response.json({
    importedFunctionName: myTemporalWorkflow.name,
    importedArrowName: arrowWorkflow.name,
    localFunctionName: localFn.name,
  });
}

/** Liveness check: answers without touching the database. */
export function GET() {
  return Response.json({ status: 'ok' });
}

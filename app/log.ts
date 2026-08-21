export function vtLog(event: string) {
  const w = window as any
  w.__vtLog = w.__vtLog || []
  w.__vtLog.push(event)
}

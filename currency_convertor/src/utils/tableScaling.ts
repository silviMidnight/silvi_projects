export function generateTableValues(rate: number): number[] {
  if (rate > 500) {
    return [100, 500, 1000, 2000, 5000, 10000, 20000, 50000];
  }
  if (rate > 100) {
    return [1, 5, 10, 50, 100, 500, 1000, 5000];
  }
  if (rate > 10) {
    return [1, 2, 5, 10, 20, 50, 100, 500];
  }
  if (rate > 1) {
    return [1, 2, 5, 10, 20, 50, 100, 200];
  }
  if (rate > 0.1) {
    return [1, 5, 10, 20, 50, 100, 200, 500];
  }
  if (rate > 0.01) {
    return [1, 10, 50, 100, 500, 1000, 5000, 10000];
  }
  return [1, 10, 100, 500, 1000, 5000, 10000, 50000];
}

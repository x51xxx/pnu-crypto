export function pow_mod(x: number, y: number, p: number) {
  let res = 1;

  // Update x if it is more than or equal to p
  x = x % p;
  while (y > 0) {
    if (y & 1)
      res = (res * x) % p;

    // y must be even now
    y = y >> 1; // y = y/2
    x = (x * x) % p;
  }

  return res;
}

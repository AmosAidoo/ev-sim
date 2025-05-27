/**
 * XOR Shift Pseudo-random generator
 * Implementation based on https://en.m.wikipedia.org/wiki/Xorshift
 */
export default class XORShiftGenerator {
  /**
   * Current state of generator
   */
  _state: number

  /**
   * Constructs a new generator based on a seed
   * @param seed Initial seed
   */
  constructor(seed: number) {
    this._state = seed
  }

  /**
   * Generate the next random number in the sequence based on the
   * xorshift algorithm
   * @returns a random number
   */
  next(): number {
    let x = this._state
    x ^= x << 13
    x ^= x >> 17
    x ^= x << 5
    this._state = x
    return (this._state >>> 0) / 0xFFFFFFFF
  }
}

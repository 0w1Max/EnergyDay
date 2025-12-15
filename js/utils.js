export const lock = (fn, delay) => (...args) => {
  if (fn.l) return;
  fn.l = true;
  fn(...args);
  setTimeout(() => (fn.l = false), delay);
};

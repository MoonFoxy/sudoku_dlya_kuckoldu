async function sleep(ms: number): Promise<void> {
  return new Promise((resolve: () => void) => {
    setTimeout(resolve, ms);
  });
}

const getUniqueId = ((): () => number => {
  let id = 1;
  function add(): number {
    id += 1;
    return id;
  }
  return add;
})();

export { sleep, getUniqueId };

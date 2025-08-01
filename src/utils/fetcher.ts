export async function fetcher(input: RequestInfo, init?: RequestInit) {
  try {
    const res = await fetch(input, init);
    return res;
  } catch (err: any) {
    if (err instanceof TypeError && err.message === 'Failed to fetch') {
      throw new Error('Server hiện đang offline. Vui lòng thử lại sau.');
    }
    throw err;
  }
}

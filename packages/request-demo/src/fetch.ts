const fetchRequest = async (url: string, init?: RequestInit) => {
  const response = await fetch(url, init);
  return response;
};

export default fetchRequest;

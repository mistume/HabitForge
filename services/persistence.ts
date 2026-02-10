
export const saveToLocal = (data: any) => {
  localStorage.setItem('habitforge_data', JSON.stringify(data));
};

export const loadFromLocal = () => {
  const data = localStorage.getItem('habitforge_data');
  return data ? JSON.parse(data) : null;
};

function createObject(obj) {
  const result = {};

  for (const path in obj) {
    const parts = path.split('.');
    let current = result;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      if (i === parts.length - 1) {
        current[part] = obj[path];
      } else {
        current[part] = current[part] || {};
        current = current[part];
      }
    }
  }

  return result;
}

export const convertRawJsonToObject = async (rawJson) => {
  const result = [];
  for (const obj of rawJson) {
    const newObject = createObject(obj);
    result.push(newObject);
  }
  return result;
};

export function exportCharacter(character) {
  const blob = new Blob([JSON.stringify(character, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${character.name || "character"}.json`;
  a.click();
}

export function importCharacter(file, callback) {
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      callback(data, null);
    } catch (err) {
      callback(null, err);
    }
  };
  reader.onerror = e => callback(null, e.target.error);
  reader.readAsText(file);
}

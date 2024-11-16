// helper.cjs

module.exports = {
  randomName: function() {
    const names = [
      "Alice",
      "Bob",
      "Charlie",
      "Diana",
      "Ethan",
      "Fiona",
      "George",
      "Hannah",
      "Ian",
      "Jane",
      "Kevin",
      "Laura",
      "Mike",
      "Nina",
      "Oscar",
      "Paula",
      "Quentin",
      "Rachel",
      "Steve",
      "Tina"
    ];
    return names[Math.floor(Math.random() * names.length)];
  },
  randomInt: function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
};

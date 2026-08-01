const version = process.argv[2] ?? "0.0.0";
const seed = [...version].reduce(
  (total, character) => total + character.charCodeAt(0),
  0,
);
const eyes = ["Watchful", "Electric", "Prismatic", "Neon", "Quiet", "Cosmic"];
const things = ["Moth", "Warden", "Orb", "Palantir", "Firefly", "Sentinel"];
console.log(
  `${eyes[seed % eyes.length]} ${things[Math.floor(seed / eyes.length) % things.length]}`,
);

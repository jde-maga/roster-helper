import specsData from "../data/specs.json";
import classData from "../data/classes.json";

const { classes } = classData;

class SpecParser {
  parsedSpecs = specsData.character_specializations.map(spec => {
    const { id } = spec;
    if (
      id === 66 ||
      id === 73 ||
      id === 104 ||
      id === 250 ||
      id === 268 ||
      id === 581
    ) {
      return { ...spec, type: "tank" };
    }
    if (
      id === 65 ||
      id === 105 ||
      id === 256 ||
      id === 257 ||
      id === 264 ||
      id === 270
    ) {
      return { ...spec, type: "heal" };
    }
    if (
      id === 62 ||
      id === 63 ||
      id === 64 ||
      id === 102 ||
      id === 253 ||
      id === 254 ||
      id === 258 ||
      id === 262 ||
      id === 265 ||
      id === 266 ||
      id === 267
    ) {
      return { ...spec, type: "ranged" };
    }
    if (
      id === 70 ||
      id === 71 ||
      id === 72 ||
      id === 103 ||
      id === 251 ||
      id === 252 ||
      id === 255 ||
      id === 259 ||
      id === 260 ||
      id === 261 ||
      id === 263 ||
      id === 269 ||
      id === 577
    ) {
      return { ...spec, type: "melee" };
    }
    return spec;
  });

  roleValues = {
    tank: 1,
    heal: 2,
    melee: 3,
    ranged: 4
  };

  getRoleValueFromSpec = spec => {
    if (!spec) {
      return 999;
    }
    return this.roleValues[spec.type];
  };

  getTypeFromSpec = spec => {
    if (!spec) return null;

    return this.parsedSpecs.find(parsedSpec => parsedSpec.id === spec.id).type;
  };

  getClassFromId = classId =>
    classes.find(e => e.id === classId)?.name || "Unknown";

  stylizeClassName = className => {
    if (className === "Chevalier de la mort") return "DK";
    if (className === "Chasseur de démons") return "DH";
    if (className === "Démoniste") return "Démo";
    if (className === "Paladin") return "Pala";
    if (className === "Guerrier") return "War";
    return className;
  };

  stylizeSpecName = spec => {
    if (!spec) return "";
    if (spec.name === "Maîtrise des bêtes") return "BM";
    if (spec.name === "Démonologie") return "Démono";
    return spec.name;
  };
}

export default new SpecParser();

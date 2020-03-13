import classData from "../data/classes.json";

import SpecParser from "./specParser";

const { classes } = classData;

class MemberParser {
  getIdFromName = name => `member-${name}`;

  filterMembers = (members, filters) =>
    members.filter(member => {
      if (
        filters.includes("unfit") &&
        (!member.character.spec || member.character.level !== 120)
      ) {
        return false;
      }
      return !filters.includes(member.character.spec?.type);
    });

  getSortMethod = sortType => {
    if (sortType === "Rank") {
      return (a, b) => {
        if (a.rank !== b.rank) {
          return a.rank - b.rank;
        }
        if (a.ignore !== b.ignore) {
          return a.ignore - b.ignore;
        }
        if (a.character.level !== b.character.level) {
          return b.character.level - a.character.level;
        }
        if (
          SpecParser.getRoleValueFromSpec(a.character.spec) !==
          SpecParser.getRoleValueFromSpec(b.character.spec)
        ) {
          return (
            SpecParser.getRoleValueFromSpec(a.character.spec) -
            SpecParser.getRoleValueFromSpec(b.character.spec)
          );
        }
        if (a.character.class !== b.character.class) {
          return a.character.class - b.character.class;
        }
        if (a.character.spec?.order !== b.character.spec?.order) {
          return a.character.spec?.order - b.character.spec?.order;
        }
        return a.id - b.id;
      };
    }
    if (sortType === "Role") {
      return (a, b) => {
        if (
          SpecParser.getRoleValueFromSpec(a.character.spec) !==
          SpecParser.getRoleValueFromSpec(b.character.spec)
        ) {
          return (
            SpecParser.getRoleValueFromSpec(a.character.spec) -
            SpecParser.getRoleValueFromSpec(b.character.spec)
          );
        }
        if (a.ignore !== b.ignore) {
          return a.ignore - b.ignore;
        }
        if (a.character.level !== b.character.level) {
          return b.character.level - a.character.level;
        }
        if (a.character.class !== b.character.class) {
          return a.character.class - b.character.class;
        }
        if (a.character.spec?.order !== b.character.spec?.order) {
          return a.character.spec?.order - b.character.spec?.order;
        }
        if (a.rank !== b.rank) {
          return a.rank - b.rank;
        }
        return a.id - b.id;
      };
    }
    if (sortType === "Class") {
      return (a, b) => {
        if (a.character.class !== b.character.class) {
          return a.character.class - b.character.class;
        }
        if (a.ignore !== b.ignore) {
          return a.ignore - b.ignore;
        }
        if (a.character.level !== b.character.level) {
          return b.character.level - a.character.level;
        }
        if (
          SpecParser.getRoleValueFromSpec(a.character.spec) !==
          SpecParser.getRoleValueFromSpec(b.character.spec)
        ) {
          return (
            SpecParser.getRoleValueFromSpec(a.character.spec) -
            SpecParser.getRoleValueFromSpec(b.character.spec)
          );
        }
        if (a.character.spec?.order !== b.character.spec?.order) {
          return a.character.spec?.order - b.character.spec?.order;
        }
        if (a.rank !== b.rank) {
          return a.rank - b.rank;
        }
        return a.id - b.id;
      };
    }
    return (a, b) => a - b;
  };

  getGroupMembers = (sortType, members, filters) => {
    const parsedMembers = this.filterMembers(members, filters).sort(
      this.getSortMethod(sortType)
    );
    let res;

    if (sortType === "Rank") {
      const maxRank = parsedMembers.reduce(
        (acc, member) => (member.rank > acc ? member.rank : acc),
        0
      );
      res = Array(maxRank + 2).fill([]);
      parsedMembers.forEach(member => {
        const index = !member.ignore ? member.rank : res.length - 1;
        res[index] = [...res[index], member];
      });
    }
    if (sortType === "Role") {
      res = Array(6).fill([]);
      parsedMembers.forEach(member => {
        if (member.ignore) {
          res[5] = [...res[5], member];
        } else if (!member.character.spec) {
          res[4] = [...res[4], member];
        } else if (member.character.spec.type === "tank") {
          res[0] = [...res[0], member];
        } else if (member.character.spec.type === "heal") {
          res[1] = [...res[1], member];
        } else if (member.character.spec.type === "melee") {
          res[2] = [...res[2], member];
        } else if (member.character.spec.type === "ranged") {
          res[3] = [...res[3], member];
        }
      });
    }
    if (sortType === "Class") {
      res = Array(classes.length + 2).fill([]);
      parsedMembers.forEach(member => {
        const index = member.ignore ? res.length - 1 : member.character.class;
        res[index] = [...res[index], member];
      });
    }

    return res;
  };
}

export default new MemberParser();

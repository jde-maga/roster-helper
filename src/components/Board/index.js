import React, { useState } from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import _ from "lodash";
import { useDrop } from "react-dnd";

import { Scrollbars } from "react-custom-scrollbars";
import {
  GiSwordSpin,
  GiCheckedShield,
  GiHealthPotion,
  GiWizardStaff
} from "react-icons/gi";
import { FaQuestion } from "react-icons/fa";

import Member from "../Member/Member";

import MemberParser from "../../services/memberParser";
import SpecParser from "../../services/specParser";

import styles from "./Board.module.css";

const Board = ({ members, type, moveMember, changeRole, ignoreMember }) => {
  const [sortType, setSortType] = useState("Rank");
  const [filteredTypes, setFilteredTypes] = useState(["unfit"]);
  const [view, setView] = useState("full");

  const parsedMembers = MemberParser.getGroupMembers(
    sortType,
    members,
    filteredTypes
  );

  const [{ isOver }, drop] = useDrop({
    accept: "member",
    drop: item => moveMember(item, type),
    collect: monitor => ({
      isOver: !!monitor.isOver()
    })
  });

  const changeSort = () => {
    if (sortType === "Rank") setSortType("Role");
    if (sortType === "Role") setSortType("Class");
    if (sortType === "Class") setSortType("Rank");
  };

  const changeView = () => {
    setView(view === "full" ? "compact" : "full");
  };

  const toggleFilter = selectedFilter => {
    const index = filteredTypes.findIndex(
      filterType => filterType === selectedFilter
    );
    if (index === -1) {
      setFilteredTypes([...filteredTypes, selectedFilter]);
    } else {
      filteredTypes.splice(index, 1);
      setFilteredTypes([...filteredTypes]);
    }
  };

  const getMembersGroupLabel = (membersGroup, currentIndex) => {
    if (currentIndex === parsedMembers.length - 1) return "Ignored";
    if (sortType === "Rank") return `Rank ${membersGroup[0].rank}`;
    if (sortType === "Role")
      return membersGroup[0].character.spec?.type || "Unknown";
    if (sortType === "Class") {
      return SpecParser.stylizeClassName(
        SpecParser.getClassFromId(membersGroup[0].character.class)
      );
    }
    return "-";
  };

  return (
    <div ref={drop} className={styles.container}>
      <div
        className={cn(styles.overlay, {
          [styles.hovering]: !!isOver
        })}
      />
      <h1 className={styles.title}>
        {type}
        <div className={styles.sort}>
          <div className={styles.link} onClick={changeView}>
            View : {view === "full" ? "Full" : "compact"}
          </div>
          <div className={styles.link} onClick={changeSort}>
            Sort by : {sortType}
          </div>
        </div>
        <div className={styles.filter}>
          Filters :
          <GiCheckedShield
            onClick={() => toggleFilter("tank")}
            className={cn(styles.filterIcons, {
              [styles.filterIconsInactive]: !!filteredTypes.includes("tank")
            })}
            size="1em"
          />
          <GiHealthPotion
            onClick={() => toggleFilter("heal")}
            className={cn(styles.filterIcons, {
              [styles.filterIconsInactive]: !!filteredTypes.includes("heal")
            })}
            size="1em"
          />
          <GiSwordSpin
            onClick={() => toggleFilter("melee")}
            className={cn(styles.filterIcons, {
              [styles.filterIconsInactive]: !!filteredTypes.includes("melee")
            })}
            size="1em"
          />
          <GiWizardStaff
            onClick={() => toggleFilter("ranged")}
            className={cn(styles.filterIcons, {
              [styles.filterIconsInactive]: !!filteredTypes.includes("ranged")
            })}
            size="1em"
          />
          <FaQuestion
            onClick={() => toggleFilter("unfit")}
            className={cn(styles.filterIcons, {
              [styles.filterIconsInactive]: !!filteredTypes.includes("unfit")
            })}
            size="1em"
          />
        </div>
      </h1>
      <div className={styles.rosterInfos}>
        <div>
          <span className={styles.roleCount}>
            {members.filter(mbr => mbr.character.spec?.type === "tank").length}
          </span>
          <GiCheckedShield size="2em" />
        </div>
        <div>
          <span className={styles.roleCount}>
            {members.filter(mbr => mbr.character.spec?.type === "heal").length}
          </span>
          <GiHealthPotion size="2em" />
        </div>
        <div>
          <span className={styles.roleCount}>
            {members.filter(mbr => mbr.character.spec?.type === "melee").length}
          </span>
          <GiSwordSpin size="2em" />
        </div>
        <div>
          <span className={styles.roleCount}>
            {
              members.filter(mbr => mbr.character.spec?.type === "ranged")
                .length
            }
          </span>
          <GiWizardStaff size="2em" />
        </div>
      </div>
      <Scrollbars>
        <div className={styles.membersContainer}>
          {parsedMembers.map((memberGroup, i) => {
            if (!memberGroup.length) {
              return null;
            }
            return (
              <div
                className={
                  view === "compact" && styles.groupMembersCompactContainer
                }
              >
                <div
                  className={cn(styles.separator, {
                    [styles.separatorCompact]: view !== "full"
                  })}
                >
                  {view === "full" && <div className={styles.line} />}
                  {getMembersGroupLabel(memberGroup, i)}
                  {view === "full" && <div className={styles.line} />}
                </div>
                <div
                  className={view === "compact" && styles.groupMembersCompact}
                >
                  {memberGroup.map(member => (
                    <Member
                      view={view}
                      ignoreMember={ignoreMember}
                      changeRole={changeRole}
                      id={member.id}
                      key={_.uniqueId("member")}
                      memberClass={member.character.class.name}
                      memberClassId={member.character.class.id}
                      level={member.character.level}
                      name={member.character.name}
                      race={member.character.race.name}
                      spec={member.character.spec}
                      thumb={member.thumb}
                      rank={member.rank}
                      ignored={member.ignore}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Scrollbars>
    </div>
  );
};

Board.propTypes = {
  members: PropTypes.arrayOf(PropTypes.object).isRequired,
  type: PropTypes.string.isRequired,
  moveMember: PropTypes.func.isRequired,
  changeRole: PropTypes.func.isRequired,
  ignoreMember: PropTypes.func.isRequired
};

export default Board;

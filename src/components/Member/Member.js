import React, { useState } from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import _ from "lodash";
import { useDrag } from "react-dnd";

import {
  GiSwordSpin,
  GiCheckedShield,
  GiHealthPotion,
  GiWizardStaff
} from "react-icons/gi";
import { FaQuestion } from "react-icons/fa";

import SpecParser from "../../services/specParser";

import styles from "./Member.module.css";

const Member = ({
  memberClass,
  level,
  name,
  race,
  thumb,
  spec,
  id,
  changeRole,
  rank,
  ignoreMember,
  ignored,
  view
}) => {
  const [, drag] = useDrag({
    item: { id: `member-${name}`, type: "member" }
  });
  const [roleHover, setRoleHover] = useState(false);
  const [memberHover, setMemberHover] = useState(false);

  const getIcon = targetSpec => {
    if (!targetSpec) return <FaQuestion size="4.5em" />;
    if (targetSpec.type === "melee") return <GiSwordSpin size="5.5em" />;
    if (targetSpec.type === "ranged") return <GiWizardStaff size="5.5em" />;
    if (targetSpec.type === "heal") return <GiHealthPotion size="5.5em" />;
    if (targetSpec.type === "tank") return <GiCheckedShield size="5.5em" />;

    return null;
  };

  const getCompactIcon = targetSpec => {
    if (!targetSpec) return <FaQuestion size="2.5em" />;
    if (targetSpec.type === "melee") return <GiSwordSpin size="2.5em" />;
    if (targetSpec.type === "ranged") return <GiWizardStaff size="2.5em" />;
    if (targetSpec.type === "heal") return <GiHealthPotion size="2.5em" />;
    if (targetSpec.type === "tank") return <GiCheckedShield size="2.5em" />;

    return null;
  };

  const swapRole = (targetId, role, dpsType) => {
    changeRole(targetId, role, dpsType);
    setRoleHover(false);
  };

  if (view === "compact") {
    return (
      <div
        ref={drag}
        className={cn(styles.containerCompact, _.kebabCase(memberClass), {
          [styles.verysmall]: level !== 120,
          [styles.ignored]: ignored
        })}
      >
        {name}
        <div className={styles.iconContainerCompact}>
          {getCompactIcon(spec)}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(styles.container, {
        [styles.ignored]: ignored,
        [styles.small]: level !== 120
      })}
      ref={drag}
      onMouseEnter={() => setMemberHover(true)}
      onMouseLeave={() => setMemberHover(false)}
      onClick={() => ignored && ignoreMember(id, false)}
    >
      {!ignored && memberHover && (
        <div className={styles.ignore} onClick={() => ignoreMember(id, true)}>
          X
        </div>
      )}
      <img
        src={`http://render-eu.worldofwarcraft.com/character/${thumb}`}
        alt="avatar"
      />
      {roleHover ? (
        <div className={cn(styles.roleSelection, _.kebabCase(memberClass))}>
          <GiWizardStaff
            className={styles.icon}
            onClick={() => swapRole(id, "ranged")}
            size="3.5em"
          />
          <GiSwordSpin
            className={styles.icon}
            onClick={() => swapRole(id, "melee")}
            size="3.5em"
          />

          <GiHealthPotion
            className={styles.icon}
            onClick={() => swapRole(id, "heal")}
            size="3.5em"
          />

          <GiCheckedShield
            size="3.5em"
            className={styles.icon}
            onClick={() => swapRole(id, "tank")}
          />
        </div>
      ) : (
        <div className={cn(styles.infos, _.kebabCase(memberClass))}>
          <div
            className={styles.iconContainer}
            onClick={() => setRoleHover(!roleHover)}
          >
            {getIcon(spec)}
          </div>
          <div className={styles.name}>
            {name} - {race} {level} / {rank}
          </div>
          <div className={styles.role}>
            <span className={styles.class}>
              {SpecParser.stylizeClassName(memberClass)}&nbsp;
            </span>
            {SpecParser.stylizeSpecName(spec)}
          </div>
        </div>
      )}
    </div>
  );
};

Member.propTypes = {
  memberClass: PropTypes.string.isRequired,
  level: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  race: PropTypes.string.isRequired,
  thumb: PropTypes.string.isRequired,
  spec: {
    role: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  },
  id: PropTypes.string.isRequired,
  changeRole: PropTypes.func.isRequired,
  rank: PropTypes.number.isRequired,
  ignoreMember: PropTypes.func.isRequired,
  ignored: PropTypes.bool.isRequired,
  view: PropTypes.string.isRequired
};

Member.defaultProps = {
  spec: undefined
};

export default Member;

import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";

import Board from "../Board";

import SoundBoard from "../../services/soundboard";
import SaveLoad from "../../services/saveLoad";
import SpecParser from "../../services/specParser";
import MemberParser from "../../services/memberParser";

import useApi from "../../hooks/useApi";

import raceData from "../../data/races.json";
import classData from "../../data/classes.json";

import styles from "./Home.module.css";

const Main = () => {
  const [guildData, guildloading, guildError] = useApi(
    "https://variation-roster-helper.herokuapp.com/api/getGuildData"
  );

  const [membersData, setMembersData] = useState([]);

  const moveMember = (item, type) => {
    const id = membersData.findIndex(member => member.id === item.id);

    membersData[id].status = type;
    setMembersData([...membersData]);

    if (type === "bench") {
      SoundBoard.playRandomSound(15000);
    }
  };

  const changeRole = (id, type) => {
    const memberIndex = membersData.findIndex(member => member.id === id);

    membersData[memberIndex].character.spec = {
      ...membersData[memberIndex].character.spec,
      type
    };
    setMembersData([...membersData]);
  };

  const ignoreMember = (id, set) => {
    const memberIndex = membersData.findIndex(member => member.id === id);

    membersData[memberIndex].ignore = set;
    setMembersData([...membersData]);
  };

  useEffect(() => {
    if (!guildData) return;
    const loadedData = SaveLoad.loadSetup();

    setMembersData(
      guildData.members.map(member => ({
        ...member,
        status:
          loadedData.find(
            e => e.id === MemberParser.getIdFromName(member.character.name)
          )?.status || "hold",
        id: MemberParser.getIdFromName(member.character.name),
        character: {
          ...member.character,
          spec: member.character.spec && {
            ...member.character.spec,
            type: SpecParser.getTypeFromSpec(member.character.spec)
          }
        },
        ignore:
          loadedData.find(
            e => e.id === MemberParser.getIdFromName(member.character.name)
          )?.ignore || false
      }))
    );
  }, [guildData]);

  if (guildError) {
    return <div>Error !</div>;
  }

  if (guildloading) {
    return <div>Loading...</div>;
  }

  SaveLoad.saveSetup(membersData);

  return (
    <DndProvider backend={Backend}>
      <div className={styles.container}>
        <Board
          ignoreMember={ignoreMember}
          changeRole={changeRole}
          moveMember={moveMember}
          members={membersData.filter(member => member.status === "hold")}
          classes={classData.classes}
          races={raceData.races}
          type="hold"
        />
        <Board
          ignoreMember={ignoreMember}
          changeRole={changeRole}
          moveMember={moveMember}
          members={membersData.filter(member => member.status === "roster")}
          classes={classData.classes}
          races={raceData.races}
          type="roster"
        />
        <Board
          ignoreMember={ignoreMember}
          changeRole={changeRole}
          moveMember={moveMember}
          members={membersData.filter(member => member.status === "bench")}
          classes={classData.classes}
          races={raceData.races}
          type="bench"
        />
      </div>
    </DndProvider>
  );
};

export default Main;

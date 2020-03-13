class SaveLoad {
  saveSetup = membersData => {
    const rosterData = membersData
      .map(member => {
        if (member.status !== "hold" || member.ignore) {
          return {
            id: member.id,
            ignore: member.ignore,
            status: member.status
          };
        }
        return undefined;
      })
      .filter(e => e);

    localStorage.setItem("rosterData", JSON.stringify(rosterData));
  };

  loadSetup = () => {
    const rosterData = JSON.parse(localStorage.getItem("rosterData"));

    return rosterData || [];
  };
}

export default new SaveLoad();

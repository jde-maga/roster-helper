import UIFx from "uifx";

import howCouldThisHappenToMeAudio from "../audio/how-could-this-happen-to-me.mp3";
import italianMusicAudio from "../audio/italian-music.mp3";
import laBouleNoireDeMotusAudio from "../audio/la-boule-noire-de-motus.mp3";
import mario64HurtAudio from "../audio/mario-64-hurt.mp3";
import hitmarkerAudio from "../audio/hitmarker.mp3";
import naniAudio from "../audio/nani.mp3";
import neinAudio from "../audio/nein.mp3";
import ohNoAudio from "../audio/oh-no.mp3";
import onVaTeTrouverDuTravailAudio from "../audio/on-va-te-trouver-du-travail.mp3";
import pacmanDyingAudio from "../audio/pacman-dying.mp3";
import sadFluteAudio from "../audio/sad-flute.mp3";
import smashBrosBatAudio from "../audio/smash-bros-bat.mp3";
import noGodPleaseNoAudio from "../audio/no-god-please-no.mp3";
import watchaSayAudio from "../audio/watcha-say.mp3";
import WellBeRightBackAudio from "../audio/well-be-right-back.mp3";
import willhelmScreamAudio from "../audio/wilhelm-scream.mp3";

const audioArray = [
  howCouldThisHappenToMeAudio,
  italianMusicAudio,
  laBouleNoireDeMotusAudio,
  mario64HurtAudio,
  hitmarkerAudio,
  naniAudio,
  neinAudio,
  ohNoAudio,
  onVaTeTrouverDuTravailAudio,
  pacmanDyingAudio,
  sadFluteAudio,
  smashBrosBatAudio,
  noGodPleaseNoAudio,
  watchaSayAudio,
  WellBeRightBackAudio,
  willhelmScreamAudio
];

class SoundBoard {
  timeout = false;

  doneSounds = [];

  playRandomSound = (timeout = 0) => {
    let rng;

    do {
      rng = Math.floor(Math.random() * audioArray.length);
    } while (this.doneSounds.includes(rng));

    if (!this.timeout) {
      this.timeout = true;
      setTimeout(() => {
        this.timeout = false;
      }, timeout);

      const sound = new UIFx(audioArray[rng]);
      sound.play(0.1);

      this.doneSounds =
        this.doneSounds.length + 1 === audioArray.length
          ? []
          : [...this.doneSounds, rng];
    }
  };
}

export default new SoundBoard();

import { ADSR } from "../interfaces/ADSR";

export class PlayNoteHelper {
  startNote(
    audioContext: AudioContext,
    frequency: number,
    adsr: ADSR,
  ): [GainNode, OscillatorNode] {
    const now = audioContext.currentTime;
    const noteOscillator = audioContext.createOscillator();
    noteOscillator.type = "sine";
    noteOscillator.frequency.setValueAtTime(frequency, now);

    const attackTime: number = Number(adsr.attackTime);
    const decayTime: number = Number(adsr.decayTime);
    const sustainLevel: number = Number(adsr.sustainLevel);
    const releaseTime: number = Number(adsr.releaseTime);
    const duration = attackTime + decayTime + releaseTime;

    const noteGain = audioContext.createGain();
    noteGain.gain.setValueAtTime(0, 0);
    noteGain.gain.linearRampToValueAtTime(1, now + attackTime);
    noteGain.gain.linearRampToValueAtTime(
      sustainLevel,
      now + attackTime + decayTime,
    );

    noteOscillator.start();
    noteOscillator.connect(noteGain);

    return [noteGain, noteOscillator];
  }

  stopNote(
    audioContext: AudioContext,
    noteGain: GainNode,
    noteOscillator: OscillatorNode,
    adsr: ADSR,
    noteStartTime: number,
  ) {
    const nowReleased = audioContext.currentTime;
    const attackTime: number = Number(adsr.attackTime);
    const decayTime: number = Number(adsr.decayTime);
    const sustainLevel: number = Number(adsr.sustainLevel);
    const releaseTime: number = Number(adsr.releaseTime);
    const duration = attackTime + decayTime + releaseTime;

    if (nowReleased > noteStartTime + attackTime + decayTime) {
      noteGain.gain.setValueAtTime(
        sustainLevel,
        noteStartTime + duration - releaseTime,
      );
      noteGain.gain.linearRampToValueAtTime(0, noteStartTime + releaseTime);
      noteOscillator.stop(noteStartTime + releaseTime);
    } else {
      noteGain.gain.setValueAtTime(
        sustainLevel,
        noteStartTime + duration - releaseTime,
      );
      noteGain.gain.linearRampToValueAtTime(0, noteStartTime + duration);
      noteOscillator.stop(nowReleased + duration);
    }
  }
}

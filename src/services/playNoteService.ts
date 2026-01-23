import { ADSR } from "../models/ADSR";

export class PlayNoteService {
  private audioContext: AudioContext;
  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
  }

  createOscillatorNode(type: string): OscillatorNode {
    const noteOscillator = this.audioContext.createOscillator();
    noteOscillator.type = <OscillatorType>type;

    return noteOscillator;
  }

  startNote(
    frequency: number,
    adsr: ADSR,
    waveformType: string,
  ): [GainNode, OscillatorNode, startTime: number] {
    const now = this.audioContext.currentTime;
    let noteOscillator = this.createOscillatorNode(waveformType);
    noteOscillator.frequency.setValueAtTime(frequency, now);
    const noteGain = this.audioContext.createGain();
    noteGain.gain.setValueAtTime(0, 0);
    noteGain.gain.linearRampToValueAtTime(1, now + adsr.attackTime);
    noteGain.gain.linearRampToValueAtTime(
      adsr.sustainLevel,
      now + adsr.attackTime + adsr.decayTime,
    );

    noteOscillator.start();
    noteOscillator.connect(noteGain);

    return [noteGain, noteOscillator, now];
  }

  stopNote(
    noteGain: GainNode,
    noteOscillator: OscillatorNode,
    adsr: ADSR,
    noteStartTime: number,
  ) {
    const noteReleaseTimeNow = this.audioContext.currentTime;

    const duration = adsr.attackTime + adsr.decayTime + adsr.releaseTime;
    const nowAndAttackAndDecay =
      noteStartTime + adsr.attackTime + adsr.decayTime;

    if (
      noteReleaseTimeNow >=
      noteStartTime + adsr.attackTime + adsr.decayTime
    ) {
      /*  noteGain.gain.setValueAtTime(
        adsr.sustainLevel,
        noteStartTime + duration - adsr.releaseTime,
      ); */
      noteGain.gain.setValueAtTime(adsr.sustainLevel, 0);
      noteGain.gain.linearRampToValueAtTime(
        0,
        noteReleaseTimeNow + adsr.releaseTime,
      );
      noteOscillator.stop(noteReleaseTimeNow + adsr.releaseTime);
    } else {
      noteGain.gain.linearRampToValueAtTime(
        adsr.sustainLevel,
        noteStartTime + adsr.attackTime + adsr.decayTime,
      );
      /* noteGain.gain.setValueAtTime(
        sustainLevel,
        noteStartTime + duration - releaseTime,
      ); */
      noteGain.gain.linearRampToValueAtTime(0, noteStartTime + duration);
      noteOscillator.stop(noteStartTime + duration);
    }
  }
}

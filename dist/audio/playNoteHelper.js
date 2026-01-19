export class PlayNoteHelper {
    startNote(audioContext, frequency, adsr) {
        const now = audioContext.currentTime;
        const noteOscillator = audioContext.createOscillator();
        noteOscillator.type = "sine";
        noteOscillator.frequency.setValueAtTime(frequency, now);
        const attackTime = Number(adsr.attackTime);
        const decayTime = Number(adsr.decayTime);
        const sustainLevel = Number(adsr.sustainLevel);
        const releaseTime = Number(adsr.releaseTime);
        const duration = attackTime + decayTime + releaseTime;
        const noteGain = audioContext.createGain();
        noteGain.gain.setValueAtTime(0, 0);
        noteGain.gain.linearRampToValueAtTime(1, now + attackTime);
        noteGain.gain.linearRampToValueAtTime(sustainLevel, now + attackTime + decayTime);
        noteOscillator.start();
        noteOscillator.connect(noteGain);
        return [noteGain, noteOscillator];
    }
    stopNote(audioContext, noteGain, noteOscillator, adsr, noteStartTime) {
        const nowReleased = audioContext.currentTime;
        const attackTime = Number(adsr.attackTime);
        const decayTime = Number(adsr.decayTime);
        const sustainLevel = Number(adsr.sustainLevel);
        const releaseTime = Number(adsr.releaseTime);
        const duration = attackTime + decayTime + releaseTime;
        if (nowReleased > noteStartTime + attackTime + decayTime) {
            noteGain.gain.setValueAtTime(sustainLevel, noteStartTime + duration - releaseTime);
            noteGain.gain.linearRampToValueAtTime(0, noteStartTime + releaseTime);
            noteOscillator.stop(noteStartTime + releaseTime);
        }
        else {
            noteGain.gain.setValueAtTime(sustainLevel, noteStartTime + duration - releaseTime);
            noteGain.gain.linearRampToValueAtTime(0, noteStartTime + duration);
            noteOscillator.stop(nowReleased + duration);
        }
    }
}

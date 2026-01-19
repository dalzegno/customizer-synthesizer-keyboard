export class PlayNoteHelper {
    startNote(audioContext, frequency, adsr) {
        console.log("Yo");
        const now = audioContext.currentTime;
        console.log(now);
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
        if (nowReleased >= noteStartTime) {
            console.log("Hello");
            console.log(nowReleased);
            noteGain.gain.setValueAtTime(sustainLevel, nowReleased + duration - releaseTime);
            noteGain.gain.linearRampToValueAtTime(0, nowReleased + releaseTime);
            noteOscillator.stop(nowReleased + releaseTime + 0.1);
        }
        else {
            console.log("what");
            noteGain.gain.setValueAtTime(sustainLevel, noteStartTime + duration - releaseTime);
            noteGain.gain.linearRampToValueAtTime(0, noteStartTime + duration);
            noteOscillator.stop(noteStartTime + duration);
        }
    }
}

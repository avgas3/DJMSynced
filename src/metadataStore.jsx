import create from "zustand";
import { immer } from "zustand/middleware/immer";

export const useMetadataStore = create()(
	immer((set) => ({
		paused: "playing",
		soundOutput: "global",
		currentlyStreaming: [],
		streamPositions: {}, // {streamLinkId: {playedSeconds, syncTimestamp}}
		togglePaused: () => set((state) => ({ paused: state.paused === "paused" ? "playing" : "paused" })),
		toggleSoundOutput: () => set((state) => ({ soundOutput: state.soundOutput === "local" ? "global" : "local" })),
		setPaused: (newPause) =>
			set((state) => {
				state.pause = newPause;
			}),
		setSoundOutput: (newOutput) =>
			set((state) => {
				state.soundOutput = newOutput;
			}),
		setCurrentlyStreaming: (newStreaming) =>
			set((state) => {
				state.currentlyStreaming = newStreaming;
			}),
		setFirstState: (newStreaming, newPaused, newSoundOutput, newStreamPositions) =>
			set((state) => {
				state.currentlyStreaming = newStreaming;
				state.paused = newPaused;
				state.soundOutput = newSoundOutput;
				state.streamPositions = newStreamPositions || {};
			}),
		updateStreamPosition: (streamLinkId, playedSeconds) =>
			set((state) => {
				state.streamPositions[streamLinkId] = {
					playedSeconds,
					syncTimestamp: Date.now()
				};
			}),
		setStreamPositions: (newPositions) =>
			set((state) => {
				state.streamPositions = newPositions;
			}),
	}))
);
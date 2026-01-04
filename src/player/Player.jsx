import React, { memo, useRef, useEffect } from "react";
import ReactPlayer from "react-player";

export function Player({streamLinkId, url, playing, loop, volume, muted, onEnded, onProgress, seekToPosition}) {
	const playerRef = useRef(null);

	useEffect(() => {
		if (playerRef.current && seekToPosition !== null && seekToPosition !== undefined) {
			playerRef.current.seekTo(seekToPosition, "seconds");
		}
	}, [seekToPosition]);

	return (
		<ReactPlayer
			ref={playerRef}
			key={streamLinkId}
			url={url}
			playing={playing}
			loop={loop}
			volume={volume}
			muted={muted}
			onEnded={onEnded}
			onProgress={onProgress}
			progressInterval={2000}
		/>
	);
}

export const MemoizedPlayer = memo(Player);

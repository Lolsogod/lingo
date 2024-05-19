import type { TextTrackInit } from 'vidstack';

export const textTracks: TextTrackInit[] = [
	// Subtitles
	{
		src: '/sub.proxy',
		label: 'English',
		language: 'en-US',
		kind: 'subtitles',
		default: true
	},
	{
		src: 'https://files.vidstack.io/sprite-fight/subs/spanish.vtt',
		label: 'Spanish',
		language: 'es-ES',
		kind: 'subtitles'
	},
	// Chapters
	{
		src: 'https://files.vidstack.io/sprite-fight/chapters.vtt',
		kind: 'chapters',
		language: 'en-US',
		default: true
	}
];

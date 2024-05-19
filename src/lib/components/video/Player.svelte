<script lang="ts">
	// Import styles.
	import 'vidstack/player/styles/default/theme.css';
	// Register elements.
	import 'vidstack/player';
	import 'vidstack/player/ui';
	import 'vidstack/icons';
	import { ParseErrorCode, parseResponse } from 'media-captions';
	import { Input } from '$lib/components/ui/input';
	import { onMount, tick } from 'svelte';
	import {
		isHLSProvider,
		type MediaCanPlayEvent,
		type MediaProviderChangeEvent,
		type MediaViewType
	} from 'vidstack';
	import type { MediaPlayerElement } from 'vidstack/elements';

	import AudioLayout from './components/layouts/AudioLayout.svelte';
	import VideoLayout from './components/layouts/VideoLayout.svelte';
	import { textTracks } from './tracks';
	import { content } from './subFix';
	import TinySegmenter from 'tiny-segmenter';
	import Popup from '../../../routes/(protected)/books/[id]/Popup.svelte';
	import { fade } from 'svelte/transition';
	import type { Word } from '../../../routes/(protected)/dictionary/types';
	import { initIndex, searchIndex } from '../../../routes/(protected)/dictionary/search';
	let results: Word[] = [];
	let search: 'loading' | 'ready' = 'loading';
	onMount(async () => {
		await initIndex();
		search = 'ready';
	});

	$: if (search === 'ready') {
		results = searchIndex(popupText);
	}
	//опять повторение кода...
	const segmenter = new TinySegmenter();
	let offset: number;
	let showPopup = false;
	let popupText = '';
	let popupX = 0;
	let popupY = 0;

	const handleWordClick = async (event: { target: any }) => {
		const word = event.target;
		const rect = word.getBoundingClientRect();
		popupText = word.textContent;
		popupX = rect.left + window.scrollX;
		showPopup = true;

		await tick(); // Wait for the next microtask to ensure the DOM is updated

		const popupHeight = offset + 10; // Dynamically get the popup's height
		const viewportHeight = window.innerHeight;
		const spaceBelow = viewportHeight - (rect.top + window.scrollY);

		if (spaceBelow < popupHeight) {
			popupY = rect.top + window.scrollY - popupHeight;
		} else {
			popupY = rect.top + window.scrollY - 40;
		}
	};
	function closePopup() {
		showPopup = false;
	}
	let words = [];

	$: words = segmenter.segment($content);

	let player: MediaPlayerElement,
		src = '',
		viewType: MediaViewType = 'unknown';

	// Initialize src.
	changeSource('youtube');

	onMount(() => {
		/**
		 * You can add these tracks using HTML as well.
		 *
		 * @example
		 * ```html
		 * <media-provider>
		 *   <track label="..." src="..." kind="..." srclang="..." default />
		 *   <track label="..." src="..." kind="..." srclang="..." />
		 * </media-provider>
		 * ```
		 */
		//for (const track of textTracks) player.textTracks.add(track);

		// Subscribe to state updates.
		return player.subscribe((state) => {
			viewType = state.viewType;
		});
	});

	function onProviderChange(event: MediaProviderChangeEvent) {
		const provider = event.detail;
		// We can configure provider's here.
		if (isHLSProvider(provider)) {
			provider.config = {};
		}
	}

	// We can listen for the `can-play` event to be notified when the player is ready.
	function onCanPlay(event: MediaCanPlayEvent) {
		// ...
	}
	/*const fuck = parseResponse(fetch('/sub.proxy'), { type: 'srt' }).then((res) => {
    console.log(res);
  });*/
	function changeSource(type: string) {
		switch (type) {
			case 'audio':
				src = 'https://files.vidstack.io/sprite-fight/audio.mp3';
				break;
			case 'video':
				src = 'https://files.vidstack.io/sprite-fight/720p.mp4';
				break;
			case 'hls':
				src = 'https://files.vidstack.io/sprite-fight/hls/stream.m3u8';
				break;
			case 'youtube':
				src = 'https://www.youtube.com/watch?v=EmFp-TVZ_WI';
				break;
			case 'vimeo':
				src = 'vimeo/640499893';
				break;
		}
	}
</script>

<Input bind:value={src} />
{#key src}
	<media-player
		class="player"
		title="Sprite Fight"
		{src}
		crossOrigin
		playsInline
		on:provider-change={onProviderChange}
		on:can-play={onCanPlay}
		bind:this={player}>
		<media-provider>
			{#if src}
				<track src="/sub.proxy?v={src}" data-type="srt" kind="captions" srclang="jp" />
			{/if}
			{#if viewType === 'video'}
				<media-poster
					class="vds-poster"
					src="https://files.vidstack.io/sprite-fight/poster.webp"
					alt="Girl walks into campfire with gnomes surrounding her friend ready for their next meal!" />
			{/if}
		</media-provider>
		<!-- Layouts -->
		{#if viewType === 'audio'}
			<AudioLayout />
		{:else if viewType === 'video'}
			<VideoLayout thumbnails="https://files.vidstack.io/sprite-fight/thumbnails.vtt" />
		{/if}
	</media-player>
{/key}
<div class="src-buttons">
	<button on:click={() => changeSource('audio')}>Audio</button>
	<button on:click={() => changeSource('video')}>Video</button>
	<button on:click={() => changeSource('hls')}>HLS</button>
	<button on:click={() => changeSource('youtube')}>YouTube</button>
	<button on:click={() => changeSource('vimeo')}>Vimeo</button>
</div>

<div>
	{#each words as word}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<span on:click={handleWordClick}>{word}</span>
	{/each}
</div>
{#if showPopup}
	<div in:fade={{ duration: 200 }} out:fade={{ duration: 200 }}>
		<Popup
			text={popupText}
			x={popupX}
			y={popupY}
			{results}
			on:click={closePopup}
			isVisible={showPopup}
			bind:ref={offset} />
	</div>
{/if}

<style lang="postcss">
	.player {
		--media-brand: #f5f5f5;
		--media-focus-ring-color: #4e9cf6;
		--media-focus-ring: 0 0 0 3px var(--media-focus-ring-color);

		&[data-view-type='audio'] {
			--media-tooltip-y-offset: 44px;
			--media-menu-y-offset: 40px;
			--media-slider-chapter-title-color: black;
			--media-border-radius: 4px;
			background-color: #212121;
			border-radius: var(--media-border-radius);
			contain: layout;
		}

		&[data-view-type='video'] {
			--media-tooltip-y-offset: 30px;
			--media-menu-y-offset: 30px;
			aspect-ratio: 16 /9;
			background-color: #212121;
			border-radius: var(--media-border-radius);
			contain: layout;
		}

		& :global(video),
		media-poster {
			border-radius: var(--media-border-radius);
		}
	}

	.src-buttons {
		display: flex;
		align-items: center;
		justify-content: space-evenly;
		margin-top: 40px;
		margin-inline: auto;
		max-width: 300px;
	}
</style>

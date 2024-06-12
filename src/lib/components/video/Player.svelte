<script lang="ts">
	// Import styles.
	import 'vidstack/player/styles/default/theme.css';
	// Register elements.
	import { page } from '$app/stores';
	import 'vidstack/player';
	import 'vidstack/player/ui';
	import 'vidstack/icons';
	import { ParseErrorCode, parseResponse } from 'media-captions';
	import { MediaRemoteControl } from 'vidstack';
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
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import VideoItem from '../../../routes/(protected)/video/VideoItem.svelte';
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
	const remote = new MediaRemoteControl();

	const handleWordClick = async (event: { target: any }) => {
		remote.setTarget(player);
		remote.pause();
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
		remote.setTarget(player);
		remote.play();
		showPopup = false;
	}
	let words = [];

	$: words = segmenter.segment($content);

	let player: MediaPlayerElement,
		src = '',
		viewType: MediaViewType = 'unknown',
		watchHistory: { url: string; title: string; thumbnail: string }[] = [];

	const refreshHistory = () => {
		watchHistory = JSON.parse(localStorage.getItem('videoInfo') || '[]');
	};
	onMount(() => {
		refreshHistory();
		const urlParams = new URLSearchParams($page.url.search);
		if (urlParams.get('v')) {
			src = 'https://www.youtube.com/watch?v=' + urlParams.get('v') || '';
		}
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

	async function getVideoInfo(url: string) {
		// Добавляем схему, если она отсутствует
		if (!url.startsWith('http://') && !url.startsWith('https://')) {
			url = 'https://' + url;
		}

		const videoId = new URL(url).searchParams.get('v');
		const apiKey = 'AIzaSyAINrhcTmtJFEFFyx6TE9vnvHls0jiZDik'; // Замените на ваш API ключ
		console.log(url, videoId, 'id yey');
		const response = await fetch(
			`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`
		);
		const data = await response.json();

		if (data.items && data.items.length > 0) {
			const video = data.items[0].snippet;
			return {
				title: video.title,
				thumbnail: video.thumbnails.high.url,
				url: `/video?v=${videoId}`
			};
		} else {
			throw new Error('Видео не найдено');
		}
	}

	// We can listen for the `can-play` event to be notified when the player is ready.
	async function onCanPlay(event: MediaCanPlayEvent) {
		const info = await getVideoInfo(src);
		let history = JSON.parse(localStorage.getItem('videoInfo') || '[]') || [];
		history = history.filter((item: any) => item.url !== info.url);
		history.unshift(info);
		localStorage.setItem('videoInfo', JSON.stringify(history));
		refreshHistory();
	}
</script>

<h1 class="mb-5">Видео плеер</h1>
<Input bind:value={src} class="mb-5" placeholder="Ссылка на youtube видео" />
{#if src}
	{#key src}<div class="relative">
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
					<track src="/sub.proxy?v={src}" data-type="srt" kind="captions" srclang="jp" />
				</media-provider>
				<VideoLayout />
			</media-player>

			<div class="absolute bottom-20 flex w-full justify-center">
				<div class="bg-black">
					{#each words as word}
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<span class="text-2xl text-white" on:click={handleWordClick}>{word}</span>
					{/each}
				</div>
			</div>
		</div>
	{/key}
{/if}
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

<Accordion.Root class="w-full">
	<Accordion.Item value="item-1">
		<Accordion.Trigger>История просмотров</Accordion.Trigger>
		<Accordion.Content
			><div class="video-grid">
				{#each watchHistory as video (video.url)}
					<VideoItem {video} canDelete on:deleted={refreshHistory} />
				{/each}
			</div></Accordion.Content>
	</Accordion.Item>
</Accordion.Root>

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
	.video-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
		grid-gap: 1rem;
	}
</style>

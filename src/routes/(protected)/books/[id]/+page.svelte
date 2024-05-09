<script lang="ts">
	import { openBookDB } from '$lib/book/bookDb';
	import type { PageData } from './$types';
	import { onMount, tick } from 'svelte';
	import { unzip, type ZipInfo } from 'unzipit';
	import { assembleChapter } from './reader';
	import { fade } from 'svelte/transition';
	import TableOfContents from './TableOfContents.svelte';
	import Config from './Config.svelte';
	import { Button } from '$lib/components/ui/button';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';

	export let data: PageData;

	let book: Book = data.book;
	let meta: Metadata = data.meta;
	type settingsType = {
		scale: number;
		fontFamily: string;
		paginated: boolean;
		animations: boolean;
	};

	let storedSettingsJson = localStorage.getItem('settings');
	let settings: settingsType = storedSettingsJson
		? JSON.parse(storedSettingsJson)
		: {
				scale: 10,
				fontFamily: 'Default',
				paginated: window.innerWidth > 1000, // Default to paginated if screen is big enough
				animations: true
			};

	let container: HTMLElement;
	let entries: ZipInfo['entries'];
	let section: number = 0;
	let scrolled: number = 0;
	onMount(async () => {
		try {
			entries = (await unzip(book.file)).entries;
		} catch (e) {
			if ((e as Error).message.includes('permission')) {
				// Workaround to fix error in Chromium incognito mode.
				// See: https://github.com/GoogleChrome/developer.chrome.com/issues/2563
				const buffer = await book.file.arrayBuffer();
				entries = (await unzip(buffer)).entries;
			}
		}
		updateSection(meta.progress);
	});
	const updateSection = async (index: number) => {
		if (0 <= index && index < book.spine.length) {
			section = index;
			scrolled = 0;
			meta.progress = section;
			if (meta.id) {
				(await openBookDB).put('metas', meta);
			}
			container.replaceChildren(await assembleChapter(book.spine[section], entries, jumpTo));
		}
	};

	let pagesScrolled = 0;

	const jumpTo = async (href: string) => {
		const [chapter, elemId] = href.split('#');

		if (settings.paginated) {
			pagesScrolled = 0;
			container.scrollTo({ left: 0 });
		}
		if (chapter) {
			const chapterIndex = book.spine.indexOf(chapter);
			await updateSection(chapterIndex);
		}
		if (elemId) {
			// if there is an element that is to be focused
			await tick(); // Wait until chapter has been loaded
			const element = document.getElementById(elemId);
			if (!element) return;
			if (settings.paginated) {
				const left = element.getBoundingClientRect().left - container.getBoundingClientRect().left;
				pagesScrolled = Math.floor(left / container.clientWidth);
				container.scrollTo({
					left: pagesScrolled * container.clientWidth,
					behavior: settings.animations ? 'smooth' : 'instant'
				});
			} else {
				element.scrollIntoView({
					behavior: 'auto',
					block: 'center',
					inline: 'center'
				});
			}
		}
	};
	let timeout: any; //number?
	const updateAfterResize = () => {
		if (settings.paginated) {
			container.scrollTo({
				left: pagesScrolled * container.clientWidth,
				behavior: settings.animations ? 'smooth' : 'instant'
			});
		}
	};
	const handleResize = () => {
		if (settings.paginated) {
			clearTimeout(timeout);
			timeout = setTimeout(updateAfterResize, 100);
		}
	};
	const incrementSection = (inc: number) => {
		if (!settings.paginated) {
			updateSection(section + inc);
		} else {
			if (inc > 0) {
				nextPage();
			} else {
				prevPage();
			}
		}
	};
	const nextPage = () => {
		if ((pagesScrolled + 1) * container.clientWidth < container.scrollWidth) {
			pagesScrolled++;
		} else {
			updateSection(section + 1);
			pagesScrolled = 0;
		}
		container.scrollTo({
			left: pagesScrolled * container.clientWidth,
			behavior: settings.animations ? 'smooth' : 'instant'
		});
	};
	const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
	const prevPage = async () => {
		if (pagesScrolled > 0) {
			pagesScrolled--;
		} else {
			await updateSection(section - 1);
			await delay(50); // Wait so that CSS styles can be applied on previous chapter
			// Necessary since the width changes when styles are applied

			if (container.scrollWidth > container.clientWidth) {
				pagesScrolled = Math.floor(container.scrollWidth / container.clientWidth);
			} else {
				pagesScrolled = 0;
			}
		}
		container.scrollTo({
			left: pagesScrolled * container.clientWidth,
			behavior: settings.animations ? 'smooth' : 'instant'
		});
	};
	const handleKeydown = ({ key }: { key: string }) => {
		switch (key) {
			case 'ArrowLeft':
				incrementSection(-1);
				break;
			case 'ArrowRight':
				incrementSection(1);
				break;
			default:
				break;
		}
	};
</script>

<div
	class="fixed bottom-0 left-1/2 z-10 ml-10 flex -translate-x-3/4 items-start gap-5 bg-background lg:flex-col lg:left-20 lg:top-24 p-5 rounded">
	<Button href="/books" variant="outline" class="hidden lg:block">назад</Button>
	<p>{section}/{meta.length}</p>

	<TableOfContents toc={book.toc} {jumpTo} {section} />
	<Config bind:settings onScaleChange={updateAfterResize} />
</div>
<Button
	on:click={() => incrementSection(-1)}
	class="fixed bottom-10 left-10 z-10 lg:top-1/2"
	variant="outline"><ChevronLeft size={40} /></Button>
<Button
	on:click={() => incrementSection(1)}
	class="fixed bottom-10 right-10 z-10 lg:top-1/2"
	variant="outline"><ChevronRight size={40} /></Button>

<div
	id={settings.paginated ? 'containerContainer' : ''}
	style={`--scale: ${settings.scale / 10}; --fontFamily: ${settings.fontFamily}`}>
	<div
		id="container"
		class={settings.paginated ? 'paginated' : 'scrolled'}
		data-sveltekit-preload-data="off"
		bind:this={container} />
</div>
<svelte:window bind:scrollY={scrolled} on:resize={handleResize} on:keydown={handleKeydown} />

<style scoped>
	#container {
		transform-origin: top;
		margin: auto;
	}

	#container :global(p),
	#container :global(a),
	#container :global(span) {
		line-height: normal !important;
		font-family: var(--fontFamily) !important;
	}

	#container :global(img),
	#container :global(svg) {
		max-height: calc(calc(100vh - 6em) / max(var(--scale), 1));
		max-width: 100%;
		object-fit: scale-down;
	}

	.paginated {
		padding: 0 2em;
		column-count: 2;
		column-gap: 4em;
		width: auto;
		margin-bottom: 2em;
		height: calc(calc(100vh - 5em) / max(var(--scale), 1));
		overflow: hidden;
	}

	.scrolled {
		padding-top: 3em;
		padding-bottom: 2em;
		transform: scale(var(--scale));
		transform-origin: top;
		width: calc(50% / var(--scale));
	}

	@media (max-width: 1000px) {
		.scrolled {
			width: calc(90% / max(var(--scale), 1));
		}
	}

	#containerContainer {
		overflow: hidden;
		margin: auto;
		transform: scale(var(--scale));
		transform-origin: top;
		width: calc(90% / max(var(--scale), 1));
		padding-top: calc(3em / var(--scale));
	}
</style>

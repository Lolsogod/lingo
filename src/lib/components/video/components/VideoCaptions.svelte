<script lang="ts">
	let test: Element;
	import { content } from '../subFix';
	// Function to log text content
	const subToSpan = () => {
		if (test?.textContent) {
			$content = test.textContent;
		} else {
			$content = '';
		}
	};

	// Ensure the MutationObserver is added when the component is mounted
	import { onMount } from 'svelte';
	onMount(() => {
		if (test) {
			const observer = new MutationObserver(subToSpan);
			observer.observe(test, { childList: true, subtree: true, characterData: true });

			// Cleanup observer when component is destroyed
			return () => {
				observer.disconnect();
			};
		}
	});
</script>

<media-captions class="vds-captions" bind:this={test} />

<style>
	media-captions {
		opacity: 0;
		z-index: 10000;
		bottom: 0;
		transition: bottom 0.15s linear;
	}

	/* Pull captions up when controls are visible. */
	:global(media-player[data-controls]) media-captions {
		bottom: 80px;
	}

	/* Hide captions when interacting with time slider. */
	:global(media-player[data-preview]) media-captions {
		opacity: 0;
	}
</style>

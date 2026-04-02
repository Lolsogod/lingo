<script lang="ts">
	import { run } from 'svelte/legacy';

	import '../app.pcss';
	import { page } from '$app/stores';
	import { ModeWatcher } from 'mode-watcher';
	import { getFlash } from 'sveltekit-flash-message';
	import { Toaster } from '$lib/components/ui/sonner';
	import { toast } from 'svelte-sonner';
	import Navigation from '$lib/components/navigation/navigation.svelte';
	import type { User } from 'lucia';
	import type { PageData } from './$types';
	import { fly } from 'svelte/transition';

	interface Props {
		data: PageData;
		children?: import('svelte').Snippet;
	}

	let { data, children }: Props = $props();
	//console.log(data);
	let user: User | null = $derived(data.user);
	
	const flash = getFlash(page);
	run(() => {
		if ($flash) {
			switch ($flash.type) {
				case 'success':
					toast.success($flash.message);
					break;
				case 'error':
					toast.error($flash.message);
					break;
			}
		}
	});
</script>

<svelte:head>
	<title>LinGo</title>
</svelte:head>
<ModeWatcher />
<Toaster richColors />

<div class="relative flex min-h-screen flex-col">
	<Navigation {user} />
	<!--{#key data.url}
		<div
			class="mt-8 md:mt-12"in:fly={{ x: -200, duration: 300, delay: 300 }}
			out:fly={{ x: 200, duration: 300 }}>
			
			<slot />
		</div>
	{/key}-->
	<div class="mt-8 md:mt-12">
		{@render children?.()}
	</div>
</div>

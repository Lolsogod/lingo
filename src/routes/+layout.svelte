<script lang="ts">
import '../app.pcss';
import { page } from '$app/stores';
import { ModeWatcher } from 'mode-watcher';
import { getFlash } from 'sveltekit-flash-message';
import { Toaster } from '$lib/components/ui/sonner';
import { toast } from 'svelte-sonner';
import Navigation from '$lib/components/navigation/navigation.svelte';
import type { User } from 'lucia';
import type { PageData } from './$types';

export let data: PageData;
let user: User | null;
$: user = data.user;
const flash = getFlash(page);
$: if ($flash) {
	switch ($flash.type) {
		case 'success':
			toast.success($flash.message);
			break;
		case 'error':
			toast.error($flash.message);
			break;
	}
}
</script>
<svelte:head>
    <title>LinGo</title> 
</svelte:head>
<ModeWatcher />
<Toaster richColors />
<div class="relative flex min-h-screen flex-col">
	<Navigation user={user} />
	<div class="mt-8 md:mt-12">
		<slot />
	</div>
</div>

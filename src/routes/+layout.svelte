<script lang="ts">
import type { PageData } from './$types';
import '../app.pcss';
import { page } from '$app/stores';
import { ModeWatcher } from 'mode-watcher';
import { getFlash } from 'sveltekit-flash-message';
import { Toaster } from '$lib/components/ui/sonner';
import { toast } from 'svelte-sonner';
import Navigation from '$lib/components/navigation/navigation.svelte';

export let data: any;
let user: PageData['user'];
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

<ModeWatcher />
<Toaster richColors />
<div class="relative flex min-h-screen flex-col">
	<Navigation user={user} />
	<div class="mt-8 md:mt-12">
		<slot />
	</div>
</div>

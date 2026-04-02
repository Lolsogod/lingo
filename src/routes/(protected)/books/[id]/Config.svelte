<script lang="ts">
	import { onDestroy } from 'svelte';
	import { Slider } from '$lib/components/ui/slider';
	import * as Select from '$lib/components/ui/select';
	import { StickyNote, Book, Settings } from 'lucide-svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Popover from '$lib/components/ui/popover/index.js';

	interface settingsInterface {
		scale: number;
		fontFamily: string;
		paginated: boolean;
		animations: boolean;
	}

	interface Props {
		settings: settingsInterface;
		onScaleChange: () => void;
	}

	let { settings = $bindable(), onScaleChange }: Props = $props();

	let sliderVal = $state([settings.scale]);
	$effect(() => {
		settings.scale = sliderVal[0];
	});

	onDestroy(() => {
		localStorage.setItem('settings', JSON.stringify(settings));
	});

	const fonts = ['Default', 'Verdana', 'Arial', 'Courier New', 'Helvetica', 'Times New Roman'];
</script>

<Popover.Root>
	<Popover.Trigger><Settings /></Popover.Trigger>
	<Popover.Content class="flex flex-col gap-2">
		<div class="flex">
			<Select.Root type="single" bind:value={settings.fontFamily}>
				<Select.Trigger>
					{settings.fontFamily || 'Font'}
				</Select.Trigger>
				<Select.Content>
					{#each fonts as font}
						<Select.Item value={font}>{font}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
			<Button
				onclick={() => (settings.paginated = true)}
				variant={settings.paginated ? 'secondary' : 'outline'}
				class="ml-2 rounded-r-none border"><Book /></Button>
			<Button
				onclick={() => (settings.paginated = false)}
				variant={!settings.paginated ? 'secondary' : 'outline'}
				class="rounded-l-none border"><StickyNote /></Button>
		</div>

		<Slider type="multiple" bind:value={sliderVal} max={30} min={5} step={1} onchange={onScaleChange} />
	</Popover.Content>
</Popover.Root>

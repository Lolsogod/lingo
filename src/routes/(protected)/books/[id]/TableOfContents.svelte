<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { List } from 'lucide-svelte';
	export let jumpTo: (href: string) => void;
	export let section: number;
	export let toc: TableOfContentsItem[];

	const getLeafNodes = (toc: TableOfContentsItem[]): TableOfContentsItem[] => {
		return toc.flatMap((item) => (item.children ? getLeafNodes(item.children) : item));
	};

	const isCurrent = (chapter: TableOfContentsItem) => {
		if (chapter.index === section) {
			console.log(chapter.index, section);
			return true;
		}
		return false;
	};

	const chapters = getLeafNodes(toc);
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger><List /></DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.Label>Оглавление</DropdownMenu.Label>
			<DropdownMenu.Separator />
			{#each chapters as chapter}
				<DropdownMenu.Item
					on:click={() => jumpTo(chapter.href)}
					class="cursor-pointer {isCurrent(chapter) ? 'bg-accent' : ''}">
					{chapter.title}
				</DropdownMenu.Item>
			{/each}
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>

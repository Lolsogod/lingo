<script lang="ts">
	import { Trash } from 'lucide-svelte';
	import * as Card from '$lib/components/ui/card';
	import Button from '$lib/components/ui/button/button.svelte';

	export let book: Metadata;
	export let deleteBook: (id: number) => void;
</script>

<Card.Root class="group relative w-60 overflow-hidden">
	<Button
		class="absolute right-0 top-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
		variant="destructive"
		on:click={() => {if (book.id) deleteBook(book.id);}}>
		<Trash size={20} />
	</Button>
	<a href="books/{book.id}">
	<img
		src={book.cover !== undefined ? URL.createObjectURL(book.cover) : ''}
		alt="cover"
		class="h-80 w-60 bg-gray-500 object-cover" />

	<div class="p-2">
		<h4 class="truncate">{book.author}</h4>
		<h3 class="truncate text-muted-foreground">{book.title}</h3>
		<p class="truncate">{book.progress} / {book.length}</p>
	</div>
</a>
</Card.Root>

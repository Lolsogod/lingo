<script lang="ts">
    import { Card, CardContent } from "$lib/components/ui/card";
    import type { Deck } from "$lib/server/database/drizzle-schemas"
    export let deckInfo: Deck
</script>

<a href="/decks/{deckInfo.id}">
<Card class="w-36 h-52 flex flex-col cursor-pointer">
    <CardContent class="flex flex-1 items-center justify-center h-12 p-0">
        <span class="text-3xl">{deckInfo.name}</span>
    </CardContent>
</Card>
</a>

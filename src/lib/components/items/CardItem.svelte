<script lang="ts">
import { Card, CardContent } from '$lib/components/ui/card';
import type { CardWithTopic } from '$lib/server/database/schema';

export let CardInfo: CardWithTopic
</script>
<Card class="flex h-52 w-36 cursor-pointer flex-col ">
	<CardContent class="flex h-12 flex-1 items-center justify-center p-2">
		<span class="truncate text-2xl">{CardInfo.topic.name}</span>
	</CardContent>
</Card>

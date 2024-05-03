import FlexSearch from 'flexsearch'
import type {CardExp } from '$lib/server/database/schema'

export const createCardIndex = (data: CardExp[]) => {
	const cardsIndex: FlexSearch.Index = new FlexSearch.Index({ tokenize: 'forward' })
	data.forEach((card, i) => {
		cardsIndex.add(i, card.topic.name)
	})

	return cardsIndex
}

export const searchCardsIndex = (searchTerm: string, cardsIndex: FlexSearch.Index, cards:  CardExp[]) =>{
	  const match = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
	  const results = cardsIndex.search(match)
  
	  return results.map((index) => cards[index as number])
  }
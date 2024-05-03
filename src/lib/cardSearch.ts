import FlexSearch from 'flexsearch'
import type {CardExp } from '$lib/server/database/schema'
let cardsIndex: FlexSearch.Index
let cards:  CardExp[] //maybe shit

export const createCardIndex = (data: CardExp[]) => {
	cardsIndex = new FlexSearch.Index({ tokenize: 'forward' })
	data.forEach((card, i) => {
		cardsIndex.add(i, card.topic.name)
	})

	cards = data
}

export const searchCardsIndex = (searchTerm: string) =>{
	  const match = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
	  const results = cardsIndex.search(match)
  
	  return results.map((index) => cards[index as number])
  }
export const cards = (pack) => [
  {
    id: 'card-0',
    src: `/card_packs/${pack}/Card_0.svg`,
    alt: 'Card image',
    value: -1,
    text: '0',
  },
  {
    id: 'card-1',
    src: `/card_packs/${pack}/Card_0.5.svg`,
    alt: 'Card image',
    value: 1,
    text: '0.5',
    style: 'inline-block font-bold',
  },
  { id: 'card-2', src: `/card_packs/${pack}/Card_1.svg`, value: 2, text: '1' },
  {
    id: 'card-3',
    src: `/card_packs/${pack}/Card_2.svg`,
    alt: 'Card image',
    value: 3,
    text: '2',
  },
  {
    id: 'card-4',
    src: `/card_packs/${pack}/Card_3.svg`,
    alt: 'Card image',
    value: 4,
    text: '3',
  },
  {
    id: 'card-5',
    src: `/card_packs/${pack}/Card_5.svg`,
    alt: 'Card image',
    value: 5,
    text: '5',
  },
  {
    id: 'card-6',
    src: `/card_packs/${pack}/Card_8.svg`,
    alt: 'Card image',
    value: 6,
    text: '8',
  },
  {
    id: 'card-7',
    src: `/card_packs/${pack}/Card_13.svg`,
    alt: 'Card image',
    value: 7,
    text: '13',
  },
  {
    id: 'card-8',
    src: `/card_packs/${pack}/Card_20.svg`,
    alt: 'Card image',
    value: 8,
    text: '20',
  },
  {
    id: 'card-9',
    src: `/card_packs/${pack}/Card_40.svg`,
    alt: 'Card image',
    value: 9,
    text: '40',
  },
  {
    id: 'card-11',
    src: `/card_packs/${pack}/Card_questionMark.svg`,
    alt: 'Card image',
    value: 10,
    text: '?',
    style: 'inline-block font-bold',
  },
  {
    id: 'card-12',
    src: `/card_packs/${pack}/Card_infinity.svg`,
    alt: 'Card image',
    value: 11,
    text: '∞',
    style: 'inline-block font-bold text-3xl -translate-y-1',
  },
]

export const getCardByValue = (value, pack) => {
  return cards(pack).find((card) => card.value === value)
}

export default {
  cards,
  getCardByValue,
}

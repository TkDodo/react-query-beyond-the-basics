import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { SearchForm } from '@/ui-components/search-form'
import { Header } from '@/ui-components/header'
import { BookSearchItem } from '@/ui-components/book-search-item'
import { BookDetailItem } from '@/ui-components/book-detail-item'

export const Route = createFileRoute('/')({
  component: App,
})

const query = {
  data: {
    numFound: 13_629,
    docs: [
      {
        id: '0',
        coverId: 240_727,
        authorName: 'J.K. Rowling',
        title: "Harry Potter and the Philosopher's Stone",
        publishYear: 1997,
      },
      {
        id: '1',
        coverId: 8_226_196,
        authorName: 'J.R.R. Tolkien',
        title: 'The Hobbit',
        publishYear: 1937,
      },
      {
        id: '2',
        coverId: 10_523_361,
        authorName: 'George Orwell',
        title: '1984',
        publishYear: 1949,
      },
      {
        id: '3',
        coverId: 11_169_123,
        authorName: 'F. Scott Fitzgerald',
        title: 'The Great Gatsby',
        publishYear: 1925,
      },
      {
        id: '4',
        coverId: 10_958_358,
        authorName: 'Mary Shelley',
        title: 'Frankenstein',
        publishYear: 1818,
      },
      {
        id: '5',
        coverId: 10_909_258,
        authorName: 'Charlotte Brontë',
        title: 'Jane Eyre',
        publishYear: 1847,
      },
    ],
  },
}

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [id, setId] = useState<string>()
  return (
    <div className="min-h-screen bg-gray-900 p-6 text-gray-100">
      {id === undefined ? (
        <BookSearchOverview
          setId={setId}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      ) : (
        <BookDetail id={id} setId={setId} />
      )}
    </div>
  )
}

function BookSearchOverview({
  setId,
  searchQuery,
  setSearchQuery,
}: {
  setId: (id: string) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
}) {
  const handleSearch = (value: string) => {
    setSearchQuery(value)
  }

  return (
    <div>
      <Header>
        <SearchForm onSearch={handleSearch} defaultValue={searchQuery} />
      </Header>

      <div className="mb-4 flex justify-end text-sm text-gray-400">
        {query.data.numFound.toString()} records found
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {query.data.docs.map((book) => (
          <BookSearchItem key={book.title} {...book} onClick={setId} />
        ))}
      </div>
    </div>
  )
}

const mockDescription = `***A Game of Thrones*** is the inaugural novel in ***A Song of Ice and Fire***, an epic series of fantasy novels crafted by the American author **George R. R. Martin**. Published on August 1, 1996, this novel introduces readers to the richly detailed world of Westeros and Essos, where political intrigue, power struggles, and magical elements intertwine.\n\nThe story unfolds through multiple perspectives, each chapter focusing on a different character, allowing readers to experience the narrative from various angles. This complex structure has become a hallmark of Martin's storytelling, immersing readers in the lives and motivations of a diverse cast.\n\n### Plot Summary\n\nSet in the fictional continents of Westeros and Essos, the narrative revolves around the power struggles among noble families vying for the Iron Throne, the seat of power in the Seven Kingdoms of Westeros. The story is rich with political intrigue, betrayal, and epic battles, as well as a deep exploration of themes such as loyalty, honor, and the consequences of power.\n\n### Themes\n\nThe novel explores themes of power, loyalty, and the moral complexities of leadership. It delves into the consequences of ambition and the struggle between personal honor and political necessity. The richly detailed world-building and intricate character development make ***A Game of Thrones*** a compelling and immersive read.\n\n### Key Characters\n\n- **Eddard \\"Ned\\" Stark**: The honorable Lord of Winterfell and Warden of the North, known for his unwavering honor and sense of duty.\n- **Catelyn Stark**: The devoted wife of Eddard Stark, whose strength and wisdom guide her family through challenging times.\n- **Robert Baratheon**: The King of the Seven Kingdoms, who won the throne through rebellion. His reign is marked by political intrigue and personal struggles, reflecting the broader conflicts of the realm.\n- **Cersei Lannister**: The ambitious and cunning Queen of Westeros, whose political acumen and determination make her a formidable presence in the court.\n- **Jaime Lannister**: A skilled swordsman and member of the Kingsguard, known for his prowess in battle and complex loyalties.\n- **Tyrion Lannister**: The witty and resourceful dwarf, known for his sharp mind and cunning, navigating the treacherous politics of the realm.\n- **Daenerys Targaryen**: An exiled princess of House Targaryen, seeking to reclaim her birthright and restore her family's dynasty.\n- **Jon Snow**: The bastard son of Eddard Stark, who joins the Night's Watch and faces unique challenges in the far north.\n- **Sansa Stark**: The eldest daughter of Eddard Stark, initially known for her naivety and romantic ideals, who learns to navigate the complexities of court life.\n- **Arya Stark**: The youngest daughter of Eddard Stark, known for her spirited and adventurous nature, seeking her own path in the world.\n- **Bran Stark**: The second son of Eddard Stark, whose life takes a dramatic turn.\n\n### Awards and Recognition\n\n- Winner of the 1997 Locus Award\n- Nominated for the 1997 Nebula Award\n- Nominated for the 1997 World Fantasy Award\n- Winner of the 1997 Hugo Award for Best Novella for \\"Blood of the Dragon,\\" which includes the Daenerys Targaryen chapters from the novel\n- Became a New York Times Bestseller in January 2011 and reached No. 1 on the list in July 2011\n\nFollowed by: [***A Clash of Kings***][1]\n\n[1]: https://openlibrary.org/works/OL257939W`

function BookDetail({
  id,
  setId,
}: {
  id: string
  setId: (id: string | undefined) => void
}) {
  const book = query.data.docs.find((book) => book.id === id)

  return (
    <div>
      <Header />
      <BookDetailItem
        title={book?.title ?? ''}
        description={mockDescription}
        covers={[9_269_962, 10_513_947, 9_031_121, 8_773_509, 9_269_938]}
        onBack={() => {
          setId(undefined)
        }}
        authors={[]}
        links={[
          {
            title:
              'Official Book Page - A Game of Thrones (A Song of Ice and Fire, Book One) | George R.R. Martin',
            url: 'https://georgerrmartin.com/grrm_book/a-game-of-thrones-a-song-of-ice-and-fire-book-one/',
          },
          {
            title: 'Wikipedia - A Game of Thrones',
            url: 'https://en.wikipedia.org/wiki/A_Game_of_Thrones',
          },
          {
            title: 'A Wiki of Ice and Fire - A Game of Thrones',
            url: 'https://awoiaf.westeros.org/index.php/A_Game_of_Thrones',
          },
          {
            title: 'TV Tropes - A Game of Thrones (Literature)',
            url: 'https://tvtropes.org/pmwiki/pmwiki.php/Literature/AGameOfThrones',
          },
        ]}
      />
    </div>
  )
}

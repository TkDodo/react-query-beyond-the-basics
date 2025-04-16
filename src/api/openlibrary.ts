import ky from 'ky'

const limit = '6'

export type BookSearchItem = Awaited<
  ReturnType<typeof getBooks>
>['docs'][number]

export async function getBooks({ search }: { search: string }) {
  const params = new URLSearchParams({
    q: search,
    limit,
    has_fulltext: 'true',
    fields: 'key,title,author_name,first_publish_year,cover_i',
  })
  const response = await ky
    .get(`https://openlibrary.org/search.json?${params.toString()}`)
    .json<{
      numFound: number
      start: number
      offset: number
      docs: Array<{
        key: string
        title: string
        author_name: [string, ...Array<string>]
        coverId: string
        first_publish_year: number
        cover_i: number
      }>
    }>()

  return {
    ...response,
    docs: response.docs.map((doc) => ({
      id: doc.key,
      coverId: doc.cover_i,
      authorName: doc.author_name[0],
      title: doc.title,
      publishYear: doc.first_publish_year,
    })),
  }
}

export type BookDetailItem = Awaited<ReturnType<typeof getBook>>

export async function getBook(id: string) {
  const response = await ky.get(`https://openlibrary.org${id}.json`).json<{
    title: string
    description?: string
    covers?: Array<number>
    links?: Array<{ title: string; url: string }>
    authors: [{ author: { key: string } }]
  }>()

  return {
    title: response.title,
    description: response.description?.replaceAll(String.raw`\r\n`, '\n'),
    covers: response.covers?.filter((cover) => cover > 0),
    links: response.links,
    author: response.authors[0].author.key,
  }
}

export type Author = Awaited<ReturnType<typeof getAuthor>>

export async function getAuthor(id: string) {
  const response = await ky.get(`https://openlibrary.org${id}.json`).json<{
    personal_name: string
    links?: Array<{ url: string }>
  }>()

  return {
    name: response.personal_name,
    link: response.links?.map((link) => ({
      url: link.url,
    }))[0]?.url,
  }
}
